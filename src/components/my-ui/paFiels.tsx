import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type BaseT = {
  label: string;
  wrapperClassName?: string;
};
type InputProps = {
  multiline?: false;
} & BaseT &
  React.ComponentProps<typeof Input>;

type TextareaProps = {
  label: string;
  multiline: true;
} & BaseT &
  React.ComponentProps<typeof Textarea>;

type Props = InputProps | TextareaProps;

export function PaField(props: Props) {
  const { label, id } = props;
  return (
    <div className={cn("space-y-2", props.wrapperClassName)}>
      <Label htmlFor={id}>{label}</Label>
      {props.multiline ? <Textarea id={id} {...props} /> : <Input id={id} {...props} />}
    </div>
  );
}
