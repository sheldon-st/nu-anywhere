import MainNavigation from "./MainNavigation";
import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Alert,
  Modal,
  Form,
  Input,
  Button,
} from "antd";
import { Widget } from "@happyreact/react";

const { Header, Content, Sider } = Layout;

import { usePostHog } from "posthog-js/react";
import { useState, useEffect } from "react";
import { Survey } from "posthog-js";

const { TextArea } = Input;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // create a custom posthog survey modal
  const posthog = usePostHog();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [survey, setSurvey] = useState<Survey>();

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    console.log(values);
    posthog.capture("survey sent", {
      $survey_id: survey.id,
      $survey_name: survey.name,
      $survey_response: values,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const layout = {};

  const tailLayout = {};

  useEffect(() => {
    posthog.getActiveMatchingSurveys((surveys) => {
      const firstSurvey = surveys.filter((survey) => survey.type === "api")[0];
      console.log(firstSurvey);
      if (firstSurvey) {
        setSurvey(firstSurvey);
        posthog.capture("survey shown", {
          $survey_id: firstSurvey.id,
          $survey_name: firstSurvey.name,
        });
      }
    });
  }, []);

  return (
    <Layout
      style={{ width: "100%", margin: 0, backgroundColor: colorBgContainer }}
    >
      <Alert
        message="This is currently a (very) early prototype built for testing. There may be bugs and features will change. Usage data is being collected for research purposes only. If you have any feedback, please let us know with the button to the right!"
        type="warning"
        style={{ marginBottom: 16 }}
        action={
          <Button size="small" type="link" onClick={showModal}>
            Give Feedback
          </Button>
        }
      />

      <Modal
        title={"What can we do better?"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {survey?.questions.map((question) => (
            <Form.Item
              label={question.text}
              name={"feedback"}
              rules={[
                { required: question.required, message: "Required" },
                { min: 2, message: "Must be at least 2 characters" },
              ]}
              style={{ width: "100%" }}
            >
              <TextArea placeholder="Please note any issues you encountered or other feedback you have!" />

              {/* <Input /> */}
            </Form.Item>
          ))}
        </Form>
      </Modal>

      <MainNavigation />

      <Layout>
        <Layout
          style={{
            padding: 16,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {children}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default RootLayout;
