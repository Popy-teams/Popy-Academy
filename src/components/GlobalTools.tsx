import {
  AccessibilityPanel,
  DataManagement,
  RobotSimulator,
} from "./ProductTools"
import AccountCenter from "./AccountCenter"
import UpdateBanner from "./UpdateBanner"

type ToolRole = "Enfant" | "Parent" | "Enseignant" | "AESH" | "Admin"

export default function GlobalTools({
  role,
  onRoleChange,
}: {
  role: ToolRole
  onRoleChange: (role: ToolRole) => void
}) {
  return (
    <>
      <AccessibilityPanel />
      <RobotSimulator />
      <DataManagement />
      <AccountCenter currentRole={role} onRoleChange={onRoleChange} />
      <UpdateBanner />
    </>
  )
}
