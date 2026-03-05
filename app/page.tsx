"use client"

import OAWorkbench from "./components/oa-workbench"
import { MOCK_CATEGORIES, MOCK_USER } from "./lib/mock-data"

export default function Page() {
  return <OAWorkbench data={MOCK_CATEGORIES} wfIcons={{}} user={MOCK_USER} />
}
