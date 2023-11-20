import {
  Card,
  Descriptions,
  Tag,
  Typography,
  List,
  Layout,
  theme,
  Space,
  Breadcrumb,
  Tree,
  TreeDataNode,
  TreeProps,
  TreeNodeProps,
  FloatButton,
  Popover,
  Menu,
  Button,
  Alert,
} from "antd";
import {
  QuestionCircleOutlined,
  SyncOutlined,
  UnorderedListOutlined,
  FlagOutlined,
  PlusOutlined,
  SmileTwoTone,
} from "@ant-design/icons"; //import { StudentEvent } from "../../types";
import { events } from "../../data/events/events";
import { StudentEvent } from "../../types/events/event";
import React, { useState, useEffect, FC } from "react";
import { NavLink } from "react-router-dom";

/** Page to handle displaying events. should be a layout with menu on the left to switch between 'my events' and 'all events'. content on the right should be a list of events. **/
export const EventsHome: FC = () => {
  const [myEvents, setMyEvents] = useState<StudentEvent[]>([]);
  const [allEvents, setAllEvents] = useState<StudentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<StudentEvent | null>(null);

  const { token } = theme.useToken();

  const handleEventClick = (event: StudentEvent) => {
    setSelectedEvent(event);
  };

  useEffect(() => {
    // get all events
    setAllEvents(events);
    setLoading(false);
  }, []);

  return (
    <Layout style={{ backgroundColor: "white", gap: "16px" }}>
      <Layout.Sider width={300} theme="light">
        <Menu
          style={{ width: "100%" }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          <Menu.Item key="1">All Events</Menu.Item>
          <Menu.Item key="2">My Events</Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content style={{ backgroundColor: "white" }}>
        <Space
          direction="vertical"
          style={{ width: "100%", justifyContent: "end", alignItems: "end" }}
        >
          <NavLink to="/events/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Event
            </Button>
          </NavLink>
        </Space>
        <Space direction="vertical" style={{ width: "100%" }}>
          <List
            dataSource={allEvents}
            style={{ paddingTop: "16px" }}
            grid={{ gutter: 16, column: 1 }}
            renderItem={(event) => (
              <List.Item>
                <Card
                  title={event.title}
                  onClick={() => handleEventClick(event)}
                  actions={[
                    // <NavLink to={`#`}>View Details</NavLink>,
                    <NavLink to={`#`}>Register</NavLink>,
                  ]}
                  style={{ textAlign: "left" }}
                  // size="small"
                >
                  <Descriptions>
                    <Descriptions.Item label="Date">
                      {event.date.toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Organizer">
                      <Tag>{event.organizer}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Location">
                      {event.location}
                    </Descriptions.Item>
                    <Descriptions.Item label="Attendees">
                      {event.attendees.map((attendee) => (
                        <Tag>{attendee}</Tag>
                      ))}
                    </Descriptions.Item>
                  </Descriptions>
                  <Typography.Paragraph>
                    {event.description}
                  </Typography.Paragraph>
                  <Alert
                    type="success"
                    message={event.motivation}
                    showIcon
                    icon={<SmileTwoTone twoToneColor={token.colorSuccess} />}
                  />
                </Card>
              </List.Item>
            )}
          />
        </Space>
      </Layout.Content>
    </Layout>
  );
};
