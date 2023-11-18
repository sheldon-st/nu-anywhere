import axios from "axios";
import qs from "qs";
import { supabase } from "../config/supabaseClient";
import { IListing } from "../components/ListingListItem";
// get data from 'listings table' in supabase
export async function getPosts() {
  const { data, error } = await supabase.from("listings").select();
  console.log(data);
  //map data from database to IListing interface
  const listings = data?.map((listing: any) => {
    return {
      uuid: listing.uuid,
      title: listing.title || listing.name,
      price: listing.price,
      startDate: listing.start_date,
      endDate: listing.end_date,
      location: listing.Address,
      roomates: listing.roomates,
      _geoloc: {
        lat: listing._geoloc.lat,
        lng: listing._geoloc.lng,
      },
    };
  });
  return listings;
}
/* 

var data = qs.stringify({
  secret_key: "sk_live_7374757d8cab5cbd5b36926c8b44b2",
  publish_key: "pk_live_ffbfa5a8a0c23a4b1b16aacbce1d43",
});
var config = {
  method: "post",
  url: "https://api.particlespace.com/api/v1/authenticate",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: data,
};

let BEARER_TOKEN = "SET_ME";

function auth() {
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.data.token));
      BEARER_TOKEN = response.data.data.token;
    })
    .catch(function (error) {
      console.log(error);
    });
}

var config2 = {
  method: "get",
  url: "https://api.particlespace.com/api/v1/properties/rental?search=808&page_limit=5&page=2",
  headers: {
    Authorization: "Bearer " + BEARER_TOKEN,
  },
};

export async function getPosts() {
  await auth();
   await axios(config2)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}
 */
/** Return IListing */
export async function getPost(uuid: string): Promise<IListing | undefined> {
  console.log(uuid);
  const { data, error } = await supabase
    .from("listings")
    .select()
    .eq("uuid", uuid);
  console.log(data);
  try {
    if (data) {
      const listing = data[0];
      console.log(listing.images);
      return {
        uuid: listing.uuid,
        title: listing.title || listing.name,
        price: listing.rent,
        startDate: listing.start_date,
        endDate: listing.end_date,
        location: listing.Address,
        roomates: listing.roomates,
        images: listing.images,
        _geoloc: {
          lat: listing._geoloc.lat,
          lng: listing._geoloc.lng,
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

// post new listing to supabase 'listings' table
export async function createListing(listing: IListing) {
  const { data, error } = await supabase.from("listings").insert({
    uuid: listing.uuid,
    name: listing.title,
    rent: listing.price,
    start_date: listing.startDate,
    end_date: listing.endDate,
    //location: listing.location,
    //roomates: listing.roomates,
    _geoloc: {
      latitude: listing._geoloc.lat,
      longitude: listing._geoloc.lng,
    },
  });
  console.log(data);
  console.log(error);

  return data;
}
