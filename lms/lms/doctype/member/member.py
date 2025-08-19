# Copyright (c) 2025, badr.alden.abdullah@gmail.com  and contributors
# For license information, please see license.txt

# import frappe
import frappe
from frappe.model.document import Document

class Member(Document):
    @frappe.whitelist()
    def get_members(self):
        members = frappe.get_all("Member", fields=["name", "member_id", "memeber_name", "phone_number", "email", "address", "join_date", "member_type", "is_membership_valid"])
        return members
