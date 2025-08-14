# Copyright (c) 2025, badr.alden.abdullah@gmail.com  and contributors
# For license information, please see license.txt

import frappe
import requests
from frappe.model.document import Document
from frappe import _


class Book(Document):

    @frappe.whitelist()
    def fetch_book_details_from_isbn(self):
        """Fetch book details from Google Books API using this document's ISBN,
        upsert related Author/Publisher, and populate Book fields.
        """
        isbn = (self.isbn or '').strip()
        if not isbn:
            frappe.throw(_('Please enter an ISBN first'))

        # Normalize: remove dashes/spaces
        clean_isbn = isbn.replace('-', '').replace(' ', '')
        if len(clean_isbn) not in (10, 13):
            frappe.throw(_('Please enter a valid ISBN (10 or 13 digits)'))

        url = f'https://www.googleapis.com/books/v1/volumes?q=isbn:{clean_isbn}'
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json() or {}
        except Exception as exc:
            frappe.throw(_('Failed to fetch from Google Books API: {0}').format(frappe.safe_decode(str(exc))))

        items = data.get('items') or []
        if not items:
            frappe.throw(_('No book details found for ISBN {0}').format(clean_isbn))

        volume_info = (items[0] or {}).get('volumeInfo') or {}

        title = volume_info.get('title')
        authors = volume_info.get('authors') or []
        publisher_name = volume_info.get('publisher')
        description = volume_info.get('description')
        image_links = volume_info.get('imageLinks') or {}
        categories = volume_info.get("categories") or {}


        # Prefer higher-res image if available
        category = categories[0] or ''
        
        
        cover_url = (
            image_links.get('extraLarge')
            or image_links.get('large')
            or image_links.get('medium')
            or image_links.get('thumbnail')
            or image_links.get('smallThumbnail')
        )

        # Ensure Author docs exist (by author_name) and collect their docnames
        author_docnames = []
        for author_title in authors:
            existing_name = frappe.db.get_value("Author", {"author_name": author_title}, "name")
            if existing_name:
                author_docnames.append(existing_name)
            else:
                author_doc = frappe.get_doc({
                    "doctype": "Author",
                    "author_name": author_title
                })
                author_doc.insert(ignore_permissions=True)
                author_docnames.append(author_doc.name)
                author_doc.save(ignore_permissions=True)
        
       
        existing_category = frappe.db.get_value("Category", {"category_name": category}, "name")
        if not existing_category:
            category_doc = frappe.get_doc({
                "doctype": "Category",
                "category_name": category
            })
            category_doc.insert(ignore_permissions=True)
            category_doc.save(ignore_permissions=True)

        # Ensure Publisher exists (by publisher_name)
        if publisher_name:
            exists_publisher = frappe.db.get_value("Publisher", {"publisher_name": publisher_name}, "name")
            if not exists_publisher:
                new_publisher = frappe.get_doc({
                    "doctype": "Publisher",
                    "publisher_name": publisher_name
                })
                new_publisher.insert(ignore_permissions=True)
                new_publisher.save(ignore_permissions=True)


        # Prepare updates
        updated_fields = {}
        if title:
            updated_fields['book_name'] = title
        if description:
            updated_fields['description'] = description
        if cover_url:
            updated_fields['cover'] = cover_url
        if publisher_name:
            updated_fields['publisher'] = publisher_name
        if authors:
            updated_fields['authors'] = authors
        if author_docnames:
            updated_fields['author_docnames'] = author_docnames
        if(publisher_name):
            updated_fields['publisher'] = publisher_name
        if category: 
            updated_fields['category'] = category



        return {
            'updated': True,
            'fields': updated_fields,
        }

    @frappe.whitelist()
    def clear_fetched_data(self):
        """Clear fields populated from external sources, keeping only ISBN."""
        fields_to_clear = {
            'book_name': None,
            'authors_names': None,
            'publisher': None,
            'description': None,
            'cover': None,
        }
        self.update(fields_to_clear)
        return {'cleared': True}