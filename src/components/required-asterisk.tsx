export default function RequiredAsterisk({
  required = true,
}: {
  required?: boolean;
}) {
  return required ? <span className="text-red-500">*</span> : null;
}
