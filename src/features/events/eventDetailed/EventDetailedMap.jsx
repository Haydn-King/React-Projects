import GoogleMapReact from "google-map-react";
import React, { Fragment } from "react";
import { Icon, Segment } from "semantic-ui-react";

function Marker() {
  return <Icon name="marker" size="big" color="red" />;
}

export default function EventDetailedMap({ latLng }) {
  const zoom = 14;
  return (
    <Fragment>
      <Segment attached="bottom" style={{ padding: 0 }}>
        <div style={{ height: 300, width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyD6FjcMySuvlHPQQ0i7EsCOHAhnS0o7qBY",
            }}
            center={latLng}
            zoom={zoom}
          >
            <Marker lat={latLng.lat} lng={latLng.lng} />
          </GoogleMapReact>
        </div>
      </Segment>
    </Fragment>
  );
}
