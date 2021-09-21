/* global google */
import cuid from "cuid";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, updateEvent } from "../eventActions";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryData } from "../../../app/api/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import MyPlaceInput from "../../../app/common/form/MyPlaceInput";

export default function EventForm({ match, history }) {
  const dispatch = useDispatch();
  const selectedEvent = useSelector((state) =>
    state.event.events.find((e) => e.id === match.params.id)
  );

  const initialValues = selectedEvent ?? {
    title: "",
    category: "",
    description: "",
    city: {
      address: "",
      latLng: null,
    },
    venue: {
      address: "",
      latLng: null,
    },
    date: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("RUH-OH! An 'Event Title' Must Be Provided!"),
    category: Yup.string().required("RUH-OH! A 'Category' Must Be Provided!"),
    description: Yup.string().required(
      "RUH-OH! A 'Description' Must Be Provided!"
    ),
    city: Yup.object().shape({
      address: Yup.string().required("RUH-OH! A 'City' Must Be Provided!"),
    }),
    venue: Yup.object().shape({
      address: Yup.string().required("RUH-OH! A 'Venue' Must Be Provided!"),
    }),
    date: Yup.string().required("RUH-OH! A 'Date' Must Be Provided!"),
  });

  return (
    <Fragment>
      <Segment clearing>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            selectedEvent
              ? dispatch(updateEvent({ ...selectedEvent, ...values }))
              : dispatch(
                  createEvent({
                    ...values,
                    id: cuid(),
                    hostedBy: "Bob",
                    attendees: [],
                    hostPhotoURL: "/assets/user.png",
                  })
                );
            history.push("/events");
          }}
        >
          {({ isSubmitting, dirty, isValid, values }) => (
            <Form className="ui form">
              <Header sub color="teal" content="Event Details" />
              <MyTextInput name="title" placeholder="Event title" />
              <MySelectInput
                name="category"
                placeholder="Category"
                options={categoryData}
              />
              <MyTextArea
                name="description"
                placeholder="Description"
                rows={3}
              />
              <Header sub color="teal" content="Event Location Details" />
              <MyPlaceInput name="city" placeholder="city" />
              <MyPlaceInput
                name="venue"
                disabled={!values.city.latLng}
                placeholder="Venue"
                options={{
                  location: new google.maps.LatLng(values.city.latLng),
                  radius: 1000,
                  types: ["establishment"],
                }}
              />
              <MyDateInput
                name="date"
                placeholderText="Event date"
                timeFormat="HH:mm"
                showTimeSelect
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm a"
              />

              <Button
                loading={isSubmitting}
                disabled={!isValid || !dirty || isSubmitting}
                type="submit"
                floated="right"
                positive
                content="Submit"
              />
              <Button
                disabled={isSubmitting}
                as={Link}
                to="/events"
                type="submit"
                floated="right"
                content="Cancel"
              />
            </Form>
          )}
        </Formik>
      </Segment>
    </Fragment>
  );
}
