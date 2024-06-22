import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SSSelect(props: {
  placeholder?: string;
  options: { name: string; value: string}[];
  name?: string;
}) {
  return (
    <Select name={props.name}>
      <SelectTrigger>
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {props.options.map((option, index) => (
          <SelectItem key={index} value={option.value}>{option.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
