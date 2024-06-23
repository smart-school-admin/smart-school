"use client";
/** react imports */
import { useFormState } from "react-dom";

/** component imports */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SSSelect from "@/components/general/forms/ssSelect";
import DateInput from "@/components/general/forms/dateInput";
import SubmitButton from "@/components/general/forms/submitButton";
import { objectToOptions } from "@/lib/utils";
import { ProfileImageUpload } from "@/components/general/forms/imageUpload";

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
} from "@prisma/client";

export default function StudentForm({
  schools,
  courses,
}: {
  schools: { id: string; name: string }[];
  courses: { id: number; code: string; name: string }[];
}) {
  return (
    <form className="py-4 flex flex-col gap-8 w-full">
      {/************ PROFILE IMAGE [start]****************/}
      <div className="w-full flex justify-center py-4 flex-col items-center gap-4">
        Student Image
        <ProfileImageUpload name="image" />
      </div>
      {/************ PROFILE IMAGE [end]****************/}
      {/************ PERSONAL INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input name="first_name" />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input name="last_name" />
          </div>
          <div>
            <Label>Other Names</Label>
            <Input name="other_names" />
          </div>
          <div>
            <Label>Age</Label>
            <Input name="age" type="number" min={5} max={30} />
          </div>
          <div>
            <Label>Gender</Label>
            <SSSelect options={objectToOptions(GENDER)} />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <DateInput />
          </div>
          <div className="col-span-2">
            <Label>Address Type</Label>
            <SSSelect options={objectToOptions(ADDRESS_TYPE)} />
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
          </div>
          <div>
            <Label>Parent Status</Label>
            <SSSelect
              name="parent_status"
              options={objectToOptions(PARENT_STATUS)}
            />
          </div>
          <div>
            <Label>Mother&apos;s Job</Label>
            <SSSelect name="mother_job" options={objectToOptions(JOB)} />
          </div>
          <div>
            <Label>Father&apos;s Job</Label>
            <SSSelect name="mother_job" options={objectToOptions(JOB)} />
          </div>
          <div>
            <Label>Mother&apos;s Education</Label>
            <SSSelect
              name="mother_education"
              options={objectToOptions(EDUCATION)}
            />
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
          </div>
          <div>
            <Label>
              Family Relationship <small>(How close are you to family)</small>
            </Label>
            <Input type="number" min={1} max={5} />
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
          </div>
          <div>
            <Label>
              Travel Time <small>(Time to travel to school)</small>
            </Label>
            <SSSelect
              name="travel_time"
              options={objectToOptions(TRAVEL_TIME)}
            />
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
          </div>
          <div>
            <Label>
              Higher Education <small>(Do you plan to go to college)</small>
            </Label>
            <SSSelect
              name="higher_education"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
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
          </div>
          <div>
            <Label>
              Romantic Relationship{" "}
              <small>(Are you in a romantic relationship)</small>
            </Label>
            <SSSelect
              name="family_support"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
            />
          </div>
          <div>
            <Label>
              Free Time{" "}
              <small>(On a scale of 1 to 5, how social are you)</small>
            </Label>
            <Input type="number" name="free_time" min={1} max={5} />
          </div>
          <div>
            <Label>Social</Label>
            <Input type="number" name="social" min={1} max={5} />
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
          </div>
          <div>
            <Label>Year</Label>
            <Input type="number" name="year" min={1} max={6} />
          </div>
        </div>
      </div>
      {/************ ADMISSION INFORMATION [end]****************/}
      <SubmitButton />
    </form>
  );
}
