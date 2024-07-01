"use client";
/** react imports */
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";

/** component imports */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SSSelect from "@/components/general/forms/ssSelect";
import DateInput from "@/components/general/forms/dateInput";
import SubmitButton from "@/components/general/forms/submitButton";
import { objectToOptions } from "@/lib/utils";
import { ProfileImageUpload } from "@/components/general/forms/imageUpload";
import FormError from "@/components/general/forms/formError";
import { toast } from "sonner";

import { Country, State, City, IState, ICity } from "country-state-city";

/** prisma imports */
import { GENDER, EDUCATION } from "@prisma/client";

/** server actions */
import { addTeacher } from "@/app/(school)/school_admin/_actions/teachers";

export default function TeacherForm({
  subjects,
}: {
  subjects: { id: number; code: string; name: string }[];
}) {
  const [errors, action] = useFormState(addTeacher, {});
  const countries = Country.getAllCountries();
  const [statesData, setstatesData] = useState<IState[]>();
  const [citiesData, setCitiesData] = useState<ICity[]>();

  const [countryCode, setCountryCode] = useState<string>("GH");
  const [stateCode, setStateCode] = useState<string>(
    State.getStatesOfCountry("GH")[0].isoCode
  );
  const [city, setCity] = useState<string>(
    City.getCitiesOfState("GH", State.getStatesOfCountry("GH")[0].isoCode)[0]
      .name
  );

  useEffect(() => {
    setstatesData(State.getStatesOfCountry(countryCode ?? undefined));
  }, [countryCode]);

  useEffect(() => {
    setCitiesData(
      City.getCitiesOfState(countryCode ?? undefined, stateCode ?? undefined)
    );
  }, [stateCode]);

  useEffect(() => {
    statesData && setStateCode(statesData[0].isoCode);
  }, [statesData]);

  useEffect(() => {
    citiesData && setCity(citiesData[0].name);
  }, [citiesData]);

  if (errors && "errorMessage" in errors) {
    toast.error(errors.errorMessage);
    delete errors.errorMessage;
  }

  return (
    <form action={action} className="py-4 flex flex-col gap-8 w-full">
      {/************ PROFILE IMAGE [start]****************/}
      <div className="w-full flex justify-center py-4 flex-col items-center gap-4">
        Teacher's Image
        <ProfileImageUpload name="image" />
        {errors && "image" in errors && (
          <FormError>{errors.image![0]}</FormError>
        )}
      </div>
      {/************ PROFILE IMAGE [end]****************/}
      {/************ PERSONAL INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input name="first_name" />
            {errors && "first_name" in errors && (
              <FormError>{errors.first_name![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Last Name</Label>
            <Input name="last_name" />
            {errors && "last_name" in errors && (
              <FormError>{errors.last_name![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Other Names</Label>
            <Input name="other_names" />
            {errors && "other_names" in errors && (
              <FormError>{errors.other_names![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Age</Label>
            <Input name="age" type="number" min={5} max={30} />
            {errors && "age" in errors && (
              <FormError>{errors.age![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Gender</Label>
            <SSSelect options={objectToOptions(GENDER)} name="gender" />
            {errors && "gender" in errors && (
              <FormError>{errors.gender![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Date of Birth</Label>
            <DateInput name="dob" />
            {errors && "dob" in errors && (
              <FormError>{errors.dob![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Country</Label>
            <SSSelect
              defaultValue="GH"
              name="country"
              options={countries.map((country) => ({
                name: country.name,
                value: country.isoCode,
              }))}
              onValueChange={setCountryCode}
            />
            {errors && "country" in errors && (
              <FormError>{errors.country![0]}</FormError>
            )}
          </div>
          <div>
            <Label>State</Label>
            <SSSelect
              defaultValue={statesData ? statesData[0].isoCode : ""}
              name="state"
              options={statesData?.map((state) => ({
                name: state.name,
                value: state.isoCode,
              }))}
              onValueChange={setStateCode}
            />
          </div>
          <div>
            <Label>City</Label>
            <SSSelect
              name="city"
              options={citiesData?.map((city) => ({
                name: city.name,
                value: city.name,
              }))}
              onValueChange={setCity}
            />
          </div>
        </div>
      </div>
      {/************ EDUCATION INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Education Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Highest Educational Level</Label>
            <SSSelect
              name="educational_level"
              options={objectToOptions(EDUCATION)}
            />
            {errors && "educational_level" in errors && (
              <FormError>{errors.educational_level![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Length of Service</Label>
            <Input type="number" min={0} name="length_of_service" />
            {errors && "length_of_service" in errors && (
              <FormError>{errors.length_of_service![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Number of Educational Seminars Attended</Label>
            <Input type="number" min={0} name="num_seminars_attended" />
            {errors && "num_seminars_attended" in errors && (
              <FormError>{errors.num_seminars_attended![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Subject</Label>
            <SSSelect
              name="subjectId"
              options={subjects.map((subject) => ({
                name: subject.name,
                value: subject.id.toString(),
              }))}
            />
          </div>
        </div>
      </div>
      {/************ EDUCATION INFORMATION [end]****************/}
      {/************ ACCOUNT INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Account Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <Input type="text" min={0} name="email" />
            {errors && "email" in errors && (
              <FormError>{errors.email![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" min={0} name="password" />
            {errors && "password" in errors && (
              <FormError>{errors.password![0]}</FormError>
            )}
          </div>
        </div>
      </div>
      {/************ ACCOUNT INFORMATION [end]****************/}
      <SubmitButton />
    </form>
  );
}
