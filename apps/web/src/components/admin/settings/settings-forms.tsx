"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@neatly/ui";
import {
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from "react";
import { EyeIcon, EyeOffIcon } from "@/components/auth/auth-icons";
import { adminSettingsCopy } from "@/config/admin-settings";
import { AUTH_PASSWORD_MIN_LENGTH } from "@/config/auth";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { updateAdminSettings } from "@/lib/admin/settings";
import { toast } from "@/lib/toast";
import {
  updateBusinessSettingsFormSchema,
  updateSettingsEmailFormSchema,
} from "@/lib/validations/admin-mutation.schema";
import { useTheme } from "@/providers/theme-provider";

export function ProfileFields({
  initialEmail = "",
  initialName = "",
}: {
  initialEmail?: string;
  initialName?: string;
}): ReactElement {
  const nameId = useId();
  const emailId = useId();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const dirty = name !== initialName || email !== initialEmail;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(null);
    setUnavailableOpen(true);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <UnsavedNotice dirty={dirty} />
      <SettingsField htmlFor={nameId} label={adminSettingsCopy.nameLabel}>
        <Input
          id={nameId}
          onChange={(event): void => {
            setName(event.target.value);
          }}
          value={name}
        />
      </SettingsField>
      <SettingsField
        error={emailError}
        htmlFor={emailId}
        label={adminSettingsCopy.emailLabel}
      >
        <Input
          aria-invalid={emailError !== null}
          id={emailId}
          onChange={(event): void => {
            setEmail(event.target.value);
            setEmailError(null);
          }}
          type="email"
          value={email}
        />
      </SettingsField>
      <SaveBar
        dirty={dirty}
        onCancel={(): void => {
          setName(initialName);
          setEmail(initialEmail);
          setEmailError(null);
        }}
      />
      <UnavailableDialog
        onOpenChange={setUnavailableOpen}
        open={unavailableOpen}
      />
    </form>
  );
}

export function AccountFields({
  role = null,
  status = null,
}: {
  role?: string | null;
  status?: string | null;
}): ReactElement {
  return (
    <dl className="space-y-4">
      <div>
        <dt className="text-caption text-muted-foreground">
          {adminSettingsCopy.accountRoleLabel}
        </dt>
        <dd className="mt-1 text-body text-foreground">
          {role ?? adminSettingsCopy.emptyValue}
        </dd>
      </div>
      <div>
        <dt className="text-caption text-muted-foreground">
          {adminSettingsCopy.accountStatusLabel}
        </dt>
        <dd className="mt-1 text-body text-foreground">
          {status ?? adminSettingsCopy.emptyValue}
        </dd>
      </div>
    </dl>
  );
}

export function NotificationFields({
  initialEmail = "",
  persistable = false,
}: {
  initialEmail?: string;
  persistable?: boolean;
}): ReactElement {
  const emailId = useId();
  const [savedEmail, setSavedEmail] = useState(initialEmail);
  const [email, setEmail] = useState(initialEmail);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!persistable) {
      setError(adminSettingsCopy.settingsMissing);
      return;
    }

    const parsed = updateSettingsEmailFormSchema.safeParse({
      notificationEmail: email,
    });

    if (!parsed.success) {
      const fields = collectZodFieldErrors(parsed.error.issues);
      setFieldError(
        fields.notificationEmail ?? parsed.error.issues[0]?.message ?? null,
      );
      return;
    }

    setSubmitting(true);
    setError(null);
    setFieldError(null);
    const result = await updateAdminSettings({
      notificationEmail: parsed.data.notificationEmail,
    });
    setSubmitting(false);

    if (!result.ok) {
      setFieldError(result.fields.notificationEmail ?? null);
      setError(result.message);
      toast.error({ title: adminSettingsCopy.saveError });
      return;
    }

    setSavedEmail(result.data.notificationEmail);
    setEmail(result.data.notificationEmail);
    toast.success({ title: adminSettingsCopy.saveSuccess });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <SettingsField
        description={adminSettingsCopy.notificationEmailDescription}
        error={fieldError}
        htmlFor={emailId}
        label={adminSettingsCopy.notificationEmailLabel}
      >
        <Input
          id={emailId}
          onChange={(event): void => {
            setEmail(event.target.value);
            setFieldError(null);
          }}
          type="email"
          value={email}
        />
      </SettingsField>
      {error !== null ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <SaveBar
        dirty={email !== savedEmail}
        onCancel={(): void => {
          setEmail(savedEmail);
          setFieldError(null);
          setError(null);
        }}
        submitting={submitting}
      />
    </form>
  );
}

export function AppearanceFields(): ReactElement {
  const { setTheme, theme } = useTheme();
  const options = [
    { id: "system" as const, label: adminSettingsCopy.themeSystem },
    { id: "light" as const, label: adminSettingsCopy.themeLight },
    { id: "dark" as const, label: adminSettingsCopy.themeDark },
  ];

  return (
    <div className="flex flex-col gap-2" data-slot="settings-appearance">
      {options.map((option) => (
        <Button
          aria-pressed={theme === option.id}
          className="justify-start"
          key={option.id}
          onClick={(): void => {
            setTheme(option.id);
          }}
          type="button"
          variant={theme === option.id ? "secondary" : "outline"}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export function SecurityFields(): ReactElement {
  const currentId = useId();
  const nextId = useId();
  const confirmId = useId();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const dirty =
    currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (newPassword.length < AUTH_PASSWORD_MIN_LENGTH) {
      setError(`Use at least ${String(AUTH_PASSWORD_MIN_LENGTH)} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation must match.");
      return;
    }
    setError(null);
    setUnavailableOpen(true);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <UnsavedNotice dirty={dirty} />
      <PasswordField
        htmlFor={currentId}
        label={adminSettingsCopy.currentPasswordLabel}
        onChange={setCurrentPassword}
        value={currentPassword}
      />
      <PasswordField
        htmlFor={nextId}
        label={adminSettingsCopy.newPasswordLabel}
        onChange={setNewPassword}
        value={newPassword}
      />
      <PasswordField
        htmlFor={confirmId}
        label={adminSettingsCopy.confirmPasswordLabel}
        onChange={setConfirmPassword}
        value={confirmPassword}
      />
      {error !== null ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <SaveBar
        dirty={dirty}
        onCancel={(): void => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setError(null);
        }}
      />
      <UnavailableDialog
        onOpenChange={setUnavailableOpen}
        open={unavailableOpen}
      />
    </form>
  );
}

export function BusinessFields({
  initialAddress = "",
  initialEmail = "",
  initialName = "",
  initialPhone = "",
  persistable = false,
}: {
  initialAddress?: string;
  initialEmail?: string;
  initialName?: string;
  initialPhone?: string;
  persistable?: boolean;
}): ReactElement {
  const [saved, setSaved] = useState({
    address: initialAddress,
    email: initialEmail,
    name: initialName,
    phone: initialPhone,
  });
  const [values, setValues] = useState({
    address: initialAddress,
    email: initialEmail,
    name: initialName,
    phone: initialPhone,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dirty =
    values.address !== saved.address ||
    values.email !== saved.email ||
    values.name !== saved.name ||
    values.phone !== saved.phone;
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressId = useId();

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!persistable) {
      setError(adminSettingsCopy.settingsMissing);
      return;
    }

    const parsed = updateBusinessSettingsFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    const result = await updateAdminSettings({
      address: parsed.data.address,
      businessName: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
    });
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fields);
      setError(result.message);
      toast.error({ title: adminSettingsCopy.saveError });
      return;
    }

    const next = {
      address: result.data.address,
      email: result.data.email,
      name: result.data.businessName,
      phone: result.data.phone,
    };
    setSaved(next);
    setValues(next);
    toast.success({ title: adminSettingsCopy.saveSuccess });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <UnsavedNotice dirty={dirty} />
      <SettingsField
        error={fieldErrors.name}
        htmlFor={nameId}
        label={adminSettingsCopy.businessNameLabel}
      >
        <Input
          id={nameId}
          onChange={(event): void => {
            setValues({ ...values, name: event.target.value });
          }}
          value={values.name}
        />
      </SettingsField>
      <SettingsField
        error={fieldErrors.email}
        htmlFor={emailId}
        label={adminSettingsCopy.businessEmailLabel}
      >
        <Input
          id={emailId}
          onChange={(event): void => {
            setValues({ ...values, email: event.target.value });
          }}
          type="email"
          value={values.email}
        />
      </SettingsField>
      <SettingsField
        error={fieldErrors.phone}
        htmlFor={phoneId}
        label={adminSettingsCopy.businessPhoneLabel}
      >
        <Input
          id={phoneId}
          onChange={(event): void => {
            setValues({ ...values, phone: event.target.value });
          }}
          type="tel"
          value={values.phone}
        />
      </SettingsField>
      <SettingsField
        error={fieldErrors.address}
        htmlFor={addressId}
        label={adminSettingsCopy.businessAddressLabel}
      >
        <Input
          id={addressId}
          onChange={(event): void => {
            setValues({ ...values, address: event.target.value });
          }}
          value={values.address}
        />
      </SettingsField>
      {error !== null ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <SaveBar
        dirty={dirty}
        onCancel={(): void => {
          setValues(saved);
          setFieldErrors({});
          setError(null);
        }}
        submitting={submitting}
      />
    </form>
  );
}

function UnsavedNotice({ dirty }: { dirty: boolean }): ReactElement | null {
  if (!dirty) {
    return null;
  }

  return (
    <p className="text-caption text-muted-foreground">
      {adminSettingsCopy.unsavedLabel}
    </p>
  );
}

interface SettingsFieldProps {
  children: ReactNode;
  description?: string;
  error?: string | null;
  htmlFor: string;
  label: string;
}

function SettingsField({
  children,
  description,
  error,
  htmlFor,
  label,
}: SettingsFieldProps): ReactElement {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {description !== undefined ? (
        <p className="text-caption text-muted-foreground">{description}</p>
      ) : null}
      {children}
      {error !== undefined && error !== null ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface PasswordFieldProps {
  htmlFor: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

function PasswordField({
  htmlFor,
  label,
  onChange,
  value,
}: PasswordFieldProps): ReactElement {
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible
    ? adminSettingsCopy.hidePasswordLabel
    : adminSettingsCopy.showPasswordLabel;

  return (
    <SettingsField htmlFor={htmlFor} label={label}>
      <div className="relative">
        <Input
          className="pr-12"
          id={htmlFor}
          onChange={(event): void => {
            onChange(event.target.value);
          }}
          type={visible ? "text" : "password"}
          value={value}
        />
        <Button
          aria-label={toggleLabel}
          aria-pressed={visible}
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={(): void => {
            setVisible((current) => !current);
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </SettingsField>
  );
}

interface SaveBarProps {
  dirty: boolean;
  onCancel: () => void;
  submitting?: boolean;
}

function SaveBar({
  dirty,
  onCancel,
  submitting = false,
}: SaveBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      <Button disabled={!dirty || submitting} type="submit">
        {submitting ? "Saving…" : adminSettingsCopy.saveLabel}
      </Button>
      <Button
        disabled={!dirty || submitting}
        onClick={onCancel}
        type="button"
        variant="outline"
      >
        {adminSettingsCopy.cancelLabel}
      </Button>
    </div>
  );
}

interface UnavailableDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function UnavailableDialog({
  onOpenChange,
  open,
}: UnavailableDialogProps): ReactElement {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{adminSettingsCopy.unavailableTitle}</DialogTitle>
          <DialogDescription>
            {adminSettingsCopy.unavailableDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={(): void => onOpenChange(false)} type="button">
            {adminSettingsCopy.closeUnavailableLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
