# Copyright (c) 2025, badr.alden.abdullah@gmail.com  and contributors
# For license information, please see license.txt

import frappe
import requests
from frappe.model.document import Document
from frappe import _


class Article(Document):

    @frappe.whitelist()
    def fetch_book_details_from_isbn(self):
        """Fetch book details from Google Books API using this document's ISBN,
        upsert related Author/Publisher, and populate Article fields.
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
        # Prefer higher-res image if available
        cover_url = (
            image_links.get('extraLarge')
            or image_links.get('large')
            or image_links.get('medium')
            or image_links.get('thumbnail')
            or image_links.get('smallThumbnail')
        )

        # First author from Google Books
        primary_author_name = (authors[0] if authors else None)

        # Prepare updates
        updated_fields = {}
        if title:
            updated_fields['article_name'] = title
        if description:
            updated_fields['description'] = description
        if cover_url:
            updated_fields['cover'] = cover_url
        if publisher_name:
            updated_fields['publisher'] = publisher_name
        if primary_author_name:
            updated_fields['author_name'] = primary_author_name

        # Apply and save
        if updated_fields:
            self.update(updated_fields)
            self.save(ignore_permissions=True)

        return {
            'updated': True,
            'fields': updated_fields,
        }

    @frappe.whitelist()
    def clear_fetched_data(self):
        """Clear fields populated from external sources, keeping only ISBN."""
        fields_to_clear = {
            'article_name': None,
            'author_name': None,
            'publisher': None,
            'description': None,
            'cover': None,
        }
        self.update(fields_to_clear)
        self.save(ignore_permissions=True)
        return {'cleared': True}