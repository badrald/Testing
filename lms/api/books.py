# Copyright (c) 2025, badr.alden.abdullah@gmail.com and contributors
# For license information, please see license.txt

import frappe
from frappe import _


@frappe.whitelist()
def get_all_books():
    """Get all books with basic information"""
    books = frappe.get_all("Book", fields=[
        "name", 
        "article_name", 
        "isbn", 
        "publisher", 
        "status", 
        "cover",
        "total_copies",
        "available_copies",
        "category"
    ], order_by="creation desc")
    return {"success": True, "data": books}


@frappe.whitelist()
def get_book_by_id(book_id):
    """Get specific book by ID with full details"""
    try:
        book = frappe.get_doc("Book", book_id)
        
        # Get authors
        authors = []
        if hasattr(book, 'authors_names') and book.authors_names:
            for author_row in book.authors_names:
                if author_row.author:
                    author_doc = frappe.get_doc("Author", author_row.author)
                    authors.append({
                        "name": author_doc.name,
                        "author_name": author_doc.author_name
                    })
        
        book_dict = book.as_dict()
        book_dict['authors'] = authors
        
        return {"success": True, "data": book_dict}
    except frappe.DoesNotExistError:
        return {"success": False, "message": "Book not found"}


@frappe.whitelist()
def search_books(query="", category="", status="", limit=20):
    """Search books with filters"""
    filters = []
    
    if query:
        filters.extend([
            ['article_name', 'like', f'%{query}%'],
            'or',
            ['isbn', 'like', f'%{query}%'],
        ])
    
    if category:
        filters.append(['category', '=', category])
    
    if status:
        filters.append(['status', '=', status])
    
    books = frappe.get_all("Book", 
        filters=filters if filters else None,
        fields=[
            "name", 
            "article_name", 
            "isbn", 
            "publisher", 
            "status", 
            "cover",
            "category",
            "available_copies"
        ],
        limit=int(limit),
        order_by="creation desc"
    )
    return {"success": True, "data": books}


@frappe.whitelist()
def get_available_books():
    """Get only available books"""
    books = frappe.get_all("Book", 
        filters=[
            ["available_copies", ">", 0],
            ["status", "=", "Active"]
        ],
        fields=[
            "name", 
            "article_name", 
            "isbn", 
            "publisher", 
            "cover",
            "category",
            "available_copies"
        ],
        order_by="creation desc"
    )
    return {"success": True, "data": books}


@frappe.whitelist()
def get_books_by_category(category):
    """Get books by category"""
    books = frappe.get_all("Book", 
        filters={"category": category},
        fields=[
            "name", 
            "article_name", 
            "isbn", 
            "publisher", 
            "description",
            "status", 
            "cover",
            "available_copies"
        ],
        order_by="creation desc"
    )
    return {"success": True, "data": books}


@frappe.whitelist()
def get_book_stats():
    """Get books statistics"""
    total_books = frappe.db.count("Book")
    available_books = frappe.db.count("Book", {"available_copies": [">", 0]})
    borrowed_books = frappe.db.sql("""
        SELECT COALESCE(SUM(total_copies - available_copies), 0) as borrowed
        FROM tabBook
    """)[0][0]
    
    categories = frappe.get_all("Book", 
        fields=["category", "count(*) as count"],
        group_by="category",
        order_by="count desc"
    )
    
    return {
        "success": True, 
        "data": {
            "total_books": total_books,
            "available_books": available_books,
            "borrowed_books": borrowed_books,
            "categories": categories
        }
    }


@frappe.whitelist()
def add_book(**kwargs):
    """Add a new Book doc. Accepts JSON body with Book fields."""
    allowed_fields = {
        "article_name", "isbn", "publisher", "status", "cover",
        "total_copies", "available_copies", "category", "description", "authors_names"
    }

    # Basic validation to provide clearer, earlier messages
    if not kwargs.get("isbn"):
        return {"success": False, "message": _("ISBN is required")}
    if not kwargs.get("article_name"):
        return {"success": False, "message": _("Title is required")}

    try:
        doc = frappe.new_doc("Book")
        for key, val in kwargs.items():
            if key == "authors_names" and isinstance(val, (list, tuple)):
                # Reset and append authors child rows
                doc.set("authors_names", [])
                for row in val:
                    author = row.get("author") if isinstance(row, dict) else None
                    if author:
                        child = doc.append("authors_names", {})
                        child.author = author
                        child.role = row.get("role") if isinstance(row, dict) else None
            elif key in allowed_fields:
                doc.set(key, val)
        doc.insert()
        frappe.db.commit()
        return {"success": True, "data": {"name": doc.name}}
    except Exception as e:
        # Log full traceback for debugging; return concise message to client
        frappe.log_error(frappe.get_traceback(), _("Add Book Failed"))
        return {"success": False, "message": str(e)}


@frappe.whitelist()
def update_book(**kwargs):
    """Update an existing Book. Requires 'name' and any fields to update."""
    name = kwargs.get("name")
    if not name:
        return {"success": False, "message": _("Parameter 'name' is required")}
    allowed_fields = {
        "article_name", "isbn", "publisher", "status", "cover",
        "total_copies", "available_copies", "category", "description", "authors_names"
    }
    try:
        doc = frappe.get_doc("Book", name)
        for key, val in kwargs.items():
            if key == "authors_names" and isinstance(val, (list, tuple)):
                # Replace authors child table with provided rows
                doc.set("authors_names", [])
                for row in val:
                    author = row.get("author") if isinstance(row, dict) else None
                    if author:
                        child = doc.append("authors_names", {})
                        child.author = author
                        child.role = row.get("role") if isinstance(row, dict) else None
            elif key in allowed_fields:
                doc.set(key, val)
        doc.save()
        frappe.db.commit()
        return {"success": True, "data": {"name": doc.name}}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Update Book Failed"))
        return {"success": False, "message": str(e)}


@frappe.whitelist()
def delete_book(name):
    """Delete a Book by name."""
    if not name:
        return {"success": False, "message": _("Parameter 'name' is required")}
    try:
        frappe.delete_doc("Book", name)
        frappe.db.commit()
        return {"success": True}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Delete Book Failed"))
        return {"success": False, "message": str(e)}
