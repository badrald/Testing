import frappe
from frappe.utils import getdate, nowdate


def recompute_all_membership_validity():
    """Daily job: recompute membership validity for all members based on active paid memberships."""
    today = getdate(nowdate())

    # Reset all to invalid first to ensure correctness
    frappe.db.sql("update `tabLibrary Member` set is_membership_valid = 0")

    # Find members that have at least one active, paid, submitted membership
    active_members = frappe.db.sql(
        """
        select distinct lm.library_member
        from `tabLibrary Membership` lm
        where lm.docstatus = 1
          and lm.paid = 1
          and (lm.from_date is null or lm.from_date <= %(today)s)
          and (lm.to_date is null or %(today)s <= lm.to_date)
        """,
        {"today": today},
        as_dict=True,
    )

    for row in active_members:
        if row.get("library_member"):
            frappe.db.set_value("Library Member", row["library_member"], "is_membership_valid", 1)
