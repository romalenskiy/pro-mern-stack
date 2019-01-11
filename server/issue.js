const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true,
}

const issueFieldType = {
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required',
}

function cleanupIssue(issue) {
  const cleanedupIssue = {}
  Object.keys(issue).forEach((field) => {
    if (issueFieldType[field]) cleanedupIssue[field] = issue[field]
  })
  return cleanedupIssue
}

function validateIssue(issue) {
  const errors = []
  Object.keys(issueFieldType).forEach((field) => {
    if (issueFieldType[field] === 'required' && !issue[field]) errors.push(`Missing mandatory field: ${field}!`)
  })

  if (!validIssueStatus[issue.status]) errors.push(`${issue.status} is not a valid status!`)

  return (errors.length ? errors.join('; ') : null)
}

export default {
  validateIssue,
  cleanupIssue,
}
