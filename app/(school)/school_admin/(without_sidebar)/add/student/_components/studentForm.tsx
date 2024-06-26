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
import { CountrySelector } from "@/components/general/forms/CountryStateCitySelector";

import { Country, State, City, IState, ICity } from "country-state-city";

/** prisma imports */
import {
  GENDER,
  FAMILY_SIZE,
  JOB,
  PARENT_STATUS,
  EDUCATION,
  GUARDIAN,
  ADDRESS_TYPE,
  TRAVEL_TIME,
  SCHOOL_CHOICE_REASON,
  WEEKLY_STUDY_TIME,
} from "@prisma/client";

/** server actions */
import { addStudent } from "@/app/(school)/school_admin/_actions/student";

export default function StudentForm({
  schools,
  courses,
}: {
  schools: { id: string; name: string }[];
  courses: { id: number; code: string; name: string }[];
}) {
  const [errors, action] = useFormState(addStudent, {});
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
  }
  return (
    <form action={action} className="py-4 flex flex-col gap-8 w-full">
      {/************ PROFILE IMAGE [start]****************/}
      <div className="w-full flex justify-center py-4 flex-col items-center gap-4">
        Student Image
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
            <SSSelect options={objectToOptions(GENDER)} />
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
          <div className="col-span-2">
            <Label>Address Type</Label>
            <SSSelect options={objectToOptions(ADDRESS_TYPE)} />
            {errors && "address_type" in errors && (
              <FormError>{errors.address_type![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Country</Label>
            <SSSelect
              disabled
              defaultValue="GH"
              name="city"
              options={countries.map((country) => ({
                name: country.name,
                value: country.isoCode,
              }))}
              onValueChange={setCountryCode}
            />
          </div>
          <div>
            <Label>State</Label>
            <SSSelect
              defaultValue={statesData? statesData[0].isoCode: ""}
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
      {/************ PERSONAL INFORMATION [end]****************/}
      {/************ FAMILY INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Family Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Family Size</Label>
            <SSSelect
              name="family_size"
              options={objectToOptions(FAMILY_SIZE)}
            />
            {errors && "family_size" in errors && (
              <FormError>{errors.family_size![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Parent Status</Label>
            <SSSelect
              name="parent_status"
              options={objectToOptions(PARENT_STATUS)}
            />
            {errors && "parent_status" in errors && (
              <FormError>{errors.parent_status![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Mother&apos;s Job</Label>
            <SSSelect name="mother_job" options={objectToOptions(JOB)} />
            {errors && "mother_job" in errors && (
              <FormError>{errors.mother_job![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Father&apos;s Job</Label>
            <SSSelect name="father_job" options={objectToOptions(JOB)} />
            {errors && "father_job" in errors && (
              <FormError>{errors.father_job![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Mother&apos;s Education</Label>
            <SSSelect
              name="mother_education"
              options={objectToOptions(EDUCATION)}
            />
            {errors && "mother_education" in errors && (
              <FormError>{errors.mother_education![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Father&apos;s Education</Label>
            <SSSelect
              name="father_education"
              options={objectToOptions(EDUCATION)}
            />
          </div>
          <div>
            <Label>Guardian</Label>
            <SSSelect name="guardian" options={objectToOptions(GUARDIAN)} />
            {errors && "guardian" in errors && (
              <FormError>{errors.guardian![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Family Relationship <small>(How close are you to family)</small>
            </Label>
            <Input type="number" name="family_relationship" min={1} max={5} />
            {errors && "family_relationship" in errors && (
              <FormError>{errors.family_relationship![0]}</FormError>
            )}
          </div>
        </div>
      </div>
      {/************ FAMILY INFORMATION [end]****************/}
      {/************ EDUCATION INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Education Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              School Choice Reaason <small>(Reason for chooing school)</small>
            </Label>
            <SSSelect
              name="school_choice_reason"
              options={objectToOptions(SCHOOL_CHOICE_REASON)}
            />
            {errors && "school_choice_reason" in errors && (
              <FormError>{errors.school_choice_reason![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Travel Time <small>(Time to travel to school)</small>
            </Label>
            <SSSelect
              name="travel_time"
              options={objectToOptions(TRAVEL_TIME)}
            />
            {errors && "travel_time" in errors && (
              <FormError>{errors.travel_time![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Nursery School <small>(Did you attend nursery)</small>
            </Label>
            <SSSelect
              name="nursery_school"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
            {errors && "nursery_school" in errors && (
              <FormError>{errors.nursery_school![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Family Support{" "}
              <small>(Does you your family support your education)</small>
            </Label>
            <SSSelect
              name="family_support"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
            {errors && "family_support" in errors && (
              <FormError>{errors.family_support![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              School Support <small>(Do you receive financial aid)</small>
            </Label>
            <SSSelect
              name="school_support"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
            {errors && "school_support" in errors && (
              <FormError>{errors.school_support![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Extracurricular{" "}
              <small>(Do you or will you take extra activities)</small>
            </Label>
            <SSSelect
              name="activities"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
            {errors && "activities" in errors && (
              <FormError>{errors.activities![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Extra Paid Classes <small>(Do you take extra classes)</small>
            </Label>
            <SSSelect
              name="extra_paid_classes"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
            {errors && "extra_paid_classes" in errors && (
              <FormError>{errors.extra_paid_classes![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Higher Education <small>(Do you plan to go to college)</small>
            </Label>
            <SSSelect
              name="higher_ed"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
            {errors && "higher_ed" in errors && (
              <FormError>{errors.higher_ed![0]}</FormError>
            )}
          </div>
          <div className="col-span-2">
            <Label>
              Study Time <small>(Average weekly study time)</small>
            </Label>
            <SSSelect
              name="study_time"
              options={objectToOptions(WEEKLY_STUDY_TIME)}
            />
            {errors && "study_time" in errors && (
              <FormError>{errors.study_time![0]}</FormError>
            )}
          </div>
        </div>
      </div>
      {/************ EDUCATION INFORMATION [end]****************/}
      {/************ OTHER INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Other Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              Internet Access <small>(Do you have internet access)</small>
            </Label>
            <SSSelect
              name="internet_access"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
            {errors && "internet_access" in errors && (
              <FormError>{errors.internet_access![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Romantic Relationship{" "}
              <small>(Are you in a romantic relationship)</small>
            </Label>
            <SSSelect
              name="romantic_relationship"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
            {errors && "romantic_relationship" in errors && (
              <FormError>{errors.romantic_relationship![0]}</FormError>
            )}
          </div>
          <div>
            <Label>
              Free Time{" "}
              <small>(On a scale of 1 to 5, how social are you)</small>
            </Label>
            <Input type="number" name="free_time" min={1} max={5} />
            {errors && "free_time" in errors && (
              <FormError>{errors.free_time![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Social</Label>
            <Input type="number" name="social" min={1} max={5} />
            {errors && "social" in errors && (
              <FormError>{errors.social![0]}</FormError>
            )}
          </div>
        </div>
      </div>
      {/************ OTHER INFORMATION [end]****************/}
      {/************ ADMISSION INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Admission Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Course</Label>
            <SSSelect
              name="course"
              options={courses.map((course) => ({
                name: `${course.code}-${course.name}`,
                value: course.id.toString(),
              }))}
            />
            {errors && "course" in errors && (
              <FormError>{errors.course![0]}</FormError>
            )}
          </div>
          <div>
            <Label>Year</Label>
            <Input type="number" name="year" min={1} max={6} />
            {errors && "year" in errors && (
              <FormError>{errors.year![0]}</FormError>
            )}
          </div>
          <div className="col-span-2">
            <Label>Email</Label>
            <Input name="email" />
            {errors && "email" in errors && (
              <FormError>{errors.email![0]}</FormError>
            )}
          </div>
        </div>
      </div>
      {/************ ADMISSION INFORMATION [end]****************/}
      <SubmitButton />
    </form>
  );
}
