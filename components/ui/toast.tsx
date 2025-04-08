"use client"

import { CheckCircle, Info, Warning } from "@phosphor-icons/react/dist/ssr"
import { toast as sonnerToast } from "sonner"
import { Button } from "./button"

type ToastProps = {
  id: string | number
  title: string
  description?: string
  button?: {
    label: string
    onClick: () => void
  }
  status?: "error" | "info" | "success" | "warning"
}

function Toast({ title, description, button, id, status }: ToastProps) {
  return (
    <div className="border-input bg-popover flex items-center overflow-hidden rounded-xl border p-4 shadow-xs backdrop-blur-xl">
      <div className="flex flex-1 items-center">
        {status === "error" ? (
          <Warning className="text-primary mr-3 size-4" />
        ) : null}
        {status === "info" ? (
          <Info className="text-primary mr-3 size-4" />
        ) : null}
        {status === "success" ? (
          <CheckCircle className="text-primary mr-3 size-4" />
        ) : null}
        <div className="w-full">
          <p className="text-foreground text-sm font-medium">{title}</p>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
        </div>
      </div>
      {button ? (
        <div className="shrink-0">
          <Button
            size="sm"
            onClick={() => {
              button?.onClick()
              sonnerToast.dismiss(id)
            }}
            type="button"
            variant="secondary"
          >
            {button?.label}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        title={toast.title}
        description={toast?.description}
        button={toast?.button}
        status={toast?.status}
      />
    ),
    {
      position: "top-center",
    }
  )
}

export { toast }
