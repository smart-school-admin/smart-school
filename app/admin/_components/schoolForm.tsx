"use client";
/** next imports */
import { useFormState } from "react-dom";

/** component imports */
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SSSelect from "@/components/general/forms/ssSelect";
import FormError from "@/components/general/forms/formError";
import SubmitButton from "@/components/general/forms/submitButton";

/** server actions */
import { addSchool } from "../_actions/school";

const regions = [
  { name: "Greater Accra", value: "GreaterAccraRegion" },
  { name: "Ashanti Region", value: "AshantiRegion" },
];

const districts = [
  { name: "Kumasi", value: "Kumasi" },
  { name: "Adenta", value: "Adenta" },
];

export default function SchoolForm() {
  const [errors, action] = useFormState(addSchool, {});
  return (
    <form action={action} className="py-4 flex flex-col gap-8">
      <div className="py-4 flex flex-col gap-4">
      <h2 className="font-semibold">School details</h2>
        <div>
          <Label>Name</Label>
          <Input name="name" />
          {errors?.name && <FormError>{errors.name}</FormError>}
        </div>
        <div>
          <Label>Region</Label>
          <SSSelect
            name="region"
            options={regions}
            placeholder="Select Region"
          />
          {errors?.region && <FormError>{errors.region}</FormError>}
        </div>
        <div>
          <Label>District</Label>
          <SSSelect
            name="district"
            options={districts}
            placeholder="Select District"
          />
          {errors?.district && <FormError>{errors.district}</FormError>}
        </div>
        <div>
          <Label>Image of School Badge</Label>
          <Input name="badgeImage" type="file" accept=".png, .jpg, .jpeg" />
          {errors?.name && <FormError>{errors.name}</FormError>}
        </div>
      </div>
      <div className="py-4 flex flex-col gap-4">
      <h2 className="font-semibold">Administrator Details</h2>
        <div>
          <Label>First Name</Label>
          <Input name="firstName" />
          {errors?.firstName && <FormError>{errors.firstName}</FormError>}
        </div>
        <div>
          <Label>Last Name</Label>
          <Input name="lastName"/>
          {errors?.lastName && <FormError>{errors.lastName}</FormError>}
        </div>
        <div>
          <Label>Other Names</Label>
          <Input name="otherNames"/>
          {errors?.otherNames && <FormError>{errors.otherNames}</FormError>}
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email"/>
          {errors?.email && <FormError>{errors.email}</FormError>}
        </div>
        <div>
          <Label>Password</Label>
          <Input name="password" type="password"/>
          {errors?.password && <FormError>{errors.password}</FormError>}
        </div>
        <div>
          <Label>Profile Image</Label>
          <Input name="profileImage" type="file" accept=".png, .jpg, .jpeg" />
          {errors?.profileImage && <FormError>{errors.profileImage}</FormError>}
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}
