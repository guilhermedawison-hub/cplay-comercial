import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { BriefcaseBusiness, Home, Plus, Settings, Users } from "lucide-react";
import { useTranslate } from "ra-core";
import { Link, matchPath, useLocation, useMatch } from "react-router";
import { ContactCreateSheet } from "../contacts/ContactCreateSheet";
import { useState } from "react";
import { NoteCreateSheet } from "../notes/NoteCreateSheet";
import { TaskCreateSheet } from "../tasks/TaskCreateSheet";

export const MobileNavigation = () => {
  const location = useLocation();
  const translate = useTranslate();

  let currentPath: string | boolean = "/";
  if (matchPath("/", location.pathname)) {
    currentPath = "/";
  } else if (matchPath("/contacts/*", location.pathname)) {
    currentPath = "/contacts";
  } else if (matchPath("/deals/*", location.pathname)) {
    currentPath = "/deals";
  } else if (matchPath("/settings", location.pathname)) {
    currentPath = "/settings";
  } else {
    currentPath = false;
  }

  const isPwa = window.matchMedia("(display-mode: standalone)").matches;
  const isWebiOS = /iPad|iPod|iPhone/.test(window.navigator.userAgent);

  return (
    <nav
      aria-label={translate("crm.navigation.label")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur supports-[backdrop-filter]:bg-background/90"
      style={{
        paddingBottom: isPwa && isWebiOS ? 15 : undefined,
        height:
          "calc(var(--spacing) * 16)" + (isPwa && isWebiOS ? " + 15px" : ""),
      }}
    >
      <div className="mx-auto flex h-full max-w-md items-center justify-around px-2">
        <NavigationButton
          href="/"
          Icon={Home}
          label="Dashboard"
          isActive={currentPath === "/"}
        />
        <NavigationButton
          href="/contacts"
          Icon={Users}
          label="Contatos"
          isActive={currentPath === "/contacts"}
        />
        <CreateButton />
        <NavigationButton
          href="/deals"
          Icon={BriefcaseBusiness}
          label="Oportunidades"
          isActive={currentPath === "/deals"}
        />
        <SettingsButton />
      </div>
    </nav>
  );
};

const NavigationButton = ({
  href,
  Icon,
  label,
  isActive,
}: {
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
}) => (
  <Button
    asChild
    variant="ghost"
    className={cn(
      "h-12 min-w-14 flex-col gap-1 rounded-lg px-1 py-1.5 text-muted-foreground",
      isActive &&
        "bg-[var(--cplay-primary-subtle)] text-primary hover:bg-[var(--cplay-primary-subtle)] hover:text-primary",
    )}
  >
    <Link to={href}>
      <Icon className="size-5" aria-hidden="true" />
      <span className="max-w-[68px] truncate text-[0.62rem] font-semibold">
        {label}
      </span>
    </Link>
  </Button>
);

const CreateButton = () => {
  const translate = useTranslate();
  const contact_id = useMatch("/contacts/:id/*")?.params.id;
  const [contactCreateOpen, setContactCreateOpen] = useState(false);
  const [noteCreateOpen, setNoteCreateOpen] = useState(false);
  const [taskCreateOpen, setTaskCreateOpen] = useState(false);

  return (
    <>
      <ContactCreateSheet
        open={contactCreateOpen}
        onOpenChange={setContactCreateOpen}
      />
      <NoteCreateSheet
        open={noteCreateOpen}
        onOpenChange={setNoteCreateOpen}
        contact_id={contact_id}
      />
      <TaskCreateSheet
        open={taskCreateOpen}
        onOpenChange={setTaskCreateOpen}
        contact_id={contact_id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="-mt-5 h-14 w-14 rounded-full border-4 border-background shadow-lg"
            aria-label={translate("ra.action.create")}
          >
            <Plus className="size-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mb-2 min-w-52">
          <DropdownMenuItem
            className="h-11 px-4"
            onSelect={() => setContactCreateOpen(true)}
          >
            {translate("resources.contacts.forcedCaseName")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="h-11 px-4"
            onSelect={() => setNoteCreateOpen(true)}
          >
            {translate("resources.notes.forcedCaseName")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="h-11 px-4"
            onSelect={() => setTaskCreateOpen(true)}
          >
            {translate("resources.tasks.forcedCaseName")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const SettingsButton = () => {
  const location = useLocation();
  const isActive = !!matchPath("/settings", location.pathname);

  return (
    <NavigationButton
      href="/settings"
      Icon={Settings}
      label="Ajustes"
      isActive={isActive}
    />
  );
};
