// Copyright (c) 2025, badr.alden.abdullah@gmail.com  and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Article", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on('Article', {
	refresh: function(frm) {
		// Add custom button to fetch book details
		if (frm.doc.isbn && !frm.is_new()) {
			frm.add_custom_button(__('Fetch Book Details'), function() {
				fetch_book_details(frm);
			}, __('Actions'));
		}
		
		// Add button to clear fetched data
		if (!frm.is_new()) {
			frm.add_custom_button(__('Clear Fetched Data'), function() {
				clear_fetched_data(frm);
			}, __('Actions'));
		}
	},
	
	isbn: function(frm) {
		// Auto-fetch when ISBN is entered (with debounce)
		if (frm.doc.isbn && frm.doc.isbn.length >= 10) {
			// Clear any existing timeout
			if (frm.isbn_timeout) {
				clearTimeout(frm.isbn_timeout);
			}
			
			// Set new timeout to avoid too many API calls
			frm.isbn_timeout = setTimeout(function() {
				// Only auto-fetch for new documents or if user confirms
				if (frm.is_new()) {
					fetch_book_details(frm);
				} else {
					frappe.confirm(
						__('Do you want to fetch book details for this ISBN?'),
						function() {
							fetch_book_details(frm);
						}
					);
				}
			}, 1500); // Wait 1.5 seconds after user stops typing
		}
	},
	
	before_save: function(frm) {
		// Validate ISBN before saving
		if (frm.doc.isbn) {
			let clean_isbn = frm.doc.isbn.replace(/[-\s]/g, '');
			if (clean_isbn.length !== 10 && clean_isbn.length !== 13) {
				frappe.msgprint(__('Please enter a valid ISBN (10 or 13 digits)'));
				frappe.validated = false;
				return false;
			}
		}
	}
});

function fetch_book_details(frm) {
	if (!frm.doc.isbn) {
		frappe.msgprint(__('Please enter an ISBN first'));
		return;
	}
	
	// Show loading indicator
	frappe.show_alert({
		message: __('Fetching book details...'),
		indicator: 'blue'
	});
	
	// Call server method
	frappe.call({
		method: 'fetch_book_details_from_isbn',
		doc: frm.doc,
		callback: function(response) {
			if (response.message) {
				// Refresh the form to show updated data
				frm.refresh();
				frappe.show_alert({
					message: __('Book details fetched successfully'),
					indicator: 'green'
				});
			}
		},
		error: function(error) {
			console.error('Error fetching book details:', error);
			frappe.show_alert({
				message: __('Failed to fetch book details'),
				indicator: 'red'
			});
		}
	});
}

function clear_fetched_data(frm) {
	frappe.confirm(
		__('Are you sure you want to clear all fetched data? This will keep only the ISBN.'),
		function() {
			frappe.call({
				method: 'clear_fetched_data',
				doc: frm.doc,
				callback: function(response) {
					frm.refresh();
					frappe.show_alert({
						message: __('Fetched data cleared successfully'),
						indicator: 'green'
					});
				}
			});
		}
	);
}

// Helper function to format ISBN
function format_isbn(isbn) {
	if (!isbn) return isbn;
	
	let clean = isbn.replace(/[-\s]/g, '');
	
	if (clean.length === 10) {
		// Format as ISBN-10: XXX-X-XX-XXXXXX-X
		return clean.replace(/(\d{3})(\d{1})(\d{2})(\d{6})(\d{1})/, '$1-$2-$3-$4-$5');
	} else if (clean.length === 13) {
		// Format as ISBN-13: XXX-X-XX-XXXXXX-X
		return clean.replace(/(\d{3})(\d{1})(\d{3})(\d{6})(\d{1})/, '$1-$2-$3-$4-$5');
	}
	
	return isbn;
}

// Auto-format ISBN on blur
frappe.ui.form.on('Article', {
	isbn: function(frm) {
		if (frm.doc.isbn) {
			let formatted = format_isbn(frm.doc.isbn);
			if (formatted !== frm.doc.isbn) {
				frm.set_value('isbn', formatted);
			}
		}
	}
});