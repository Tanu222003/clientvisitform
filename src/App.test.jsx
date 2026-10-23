import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('Park Solitaire Client Visit App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Branding and Initial Navigation', () => {
    it('renders Park Solitaire branding and logo', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const brandNames = screen.getAllByText('Park Solitaire');
      expect(brandNames.length).toBeGreaterThan(0);

      const lifespacesSubs = screen.getAllByText('Lifespaces LLP');
      expect(lifespacesSubs.length).toBeGreaterThan(0);

      const logo = screen.getByAltText('Park Solitaire');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src');
    });

    it('does NOT have the Properties option in navigation', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.queryByRole('link', { name: /properties/i })).not.toBeInTheDocument();
    });

    it('renders core navigation options in sidebar', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /all visits/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /clients/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /reports/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    });
  });

  describe('Client Visit Form & 10-Digit Phone Validation', () => {
    it('renders all essential visit form fields with +91 country badge', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { level: 1, name: 'Visit Form' })).toBeInTheDocument();
      expect(screen.queryByText(/VIP Concierge Desk/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Client Property Visit Form/i)).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter first name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('10-digit number')).toBeInTheDocument();
      expect(screen.getByText('+91')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('shows error when required fields are missing', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const submitBtn = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText('Please fill all required fields.')).toBeInTheDocument();
    });

    it('rejects phone numbers with fewer than 10 digits', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const nameInput = screen.getByPlaceholderText('Enter first name');
      const phoneInput = screen.getByPlaceholderText('10-digit number');

      fireEvent.change(nameInput, { target: { value: 'Aarav Patel' } });
      fireEvent.change(phoneInput, { target: { value: '987654' } });

      const submitBtn = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText('Phone number must be exactly 10 digits.')).toBeInTheDocument();
    });

    it('restricts phone input to digits only and limits to 10 characters', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const phoneInput = screen.getByPlaceholderText('10-digit number');
      fireEvent.change(phoneInput, { target: { value: '98765abc4321099' } });

      // Should sanitize non-digits and cap at 10 digits
      expect(phoneInput.value).toBe('9876543210');
      expect(phoneInput.value.length).toBe(10);
    });

    it('handles pasted numbers with leading +91 or 0 gracefully', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const phoneInput = screen.getByPlaceholderText('10-digit number');

      // Paste with country code 91
      fireEvent.change(phoneInput, { target: { value: '+91 9123456789' } });
      expect(phoneInput.value).toBe('9123456789');

      // Paste with leading 0
      fireEvent.change(phoneInput, { target: { value: '09876543210' } });
      expect(phoneInput.value).toBe('9876543210');
    });
  });

  describe('Form Submission to Dashboard', () => {
    it('submits valid form and immediately navigates to Dashboard showing the new visit', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const nameInput = screen.getByPlaceholderText('Enter first name');
      const phoneInput = screen.getByPlaceholderText('10-digit number');

      fireEvent.change(nameInput, { target: { value: 'Vikram Malhotra' } });
      fireEvent.change(phoneInput, { target: { value: '9820098200' } });

      const submitBtn = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitBtn);

      // Verify immediate redirection to Dashboard (Dashboard heading)
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument();
      });

      // Verify the new submission is listed in the dashboard table
      expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();
      expect(screen.getByText('+91 98200 98200')).toBeInTheDocument();

      // Verify no reference card is displayed
      expect(screen.queryByText(/Thank you for submitting your details/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Reference No\./i)).not.toBeInTheDocument();
    });
  });

  describe('Dashboard, All Visits, and Reports Views', () => {
    it('renders Dashboard without visit stats and verifies stats shifted to All Visits', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // On Dashboard, stats are removed
      expect(screen.queryByText('TOTAL VISITS')).not.toBeInTheDocument();
      expect(screen.queryByText('PERSONAL USE')).not.toBeInTheDocument();
      expect(screen.queryByText('INVESTMENT')).not.toBeInTheDocument();

      // Dashboard displays Central Admin heading and Recent Client Submissions
      expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument();
      expect(screen.getByText('Recent Client Submissions')).toBeInTheDocument();

      // CRM Operations Workflow Tracker, Reminders, and Portfolio View are removed from Admin Dashboard
      expect(screen.queryByText(/CRM Operations Workflow Tracker/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('workflow-section')).not.toBeInTheDocument();
      expect(screen.queryByText(/Today's Action Reminders/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Portfolio View:/i)).not.toBeInTheDocument();
    });

    it('renders shifted stats (Total Visits, Today, Personal Use, Investment) in All Visits view and filters visits', () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      // Shifted stats are present on All Visits
      expect(screen.getByText('TOTAL VISITS')).toBeInTheDocument();
      expect(screen.getByText('TODAY')).toBeInTheDocument();
      expect(screen.getByText('PERSONAL USE')).toBeInTheDocument();
      expect(screen.getByText('INVESTMENT')).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText('Search client, phone, remarks...');
      expect(searchInput).toBeInTheDocument();

      // Search for specific seed visit
      fireEvent.change(searchInput, { target: { value: 'Sneha Reddy' } });
      expect(screen.getByText('Sneha Reddy')).toBeInTheDocument();
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    });

    it('renders Reports view with analytics cards and charts', () => {
      render(
        <MemoryRouter initialEntries={['/reports']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { level: 1, name: 'Reports' })).toBeInTheDocument();
      expect(screen.getByText('Visits by Property Type')).toBeInTheDocument();
      expect(screen.getByText('How Clients Heard About Us')).toBeInTheDocument();
    });

    it('renders Clients view with profile cards and stat counters matching reference design', () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      // Verify Clients heading and actions
      expect(screen.getByRole('heading', { level: 1, name: 'Clients' })).toBeInTheDocument();
      expect(screen.getByText(/All registered client profiles from visit forms/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /add client/i })).not.toBeInTheDocument();

      // Verify stat cards and pipeline flowchart removed
      expect(screen.queryByText('TOTAL CLIENTS')).not.toBeInTheDocument();
      expect(screen.queryByText('PERSONAL USE')).not.toBeInTheDocument();
      expect(screen.queryByText('INVESTORS')).not.toBeInTheDocument();
      expect(screen.queryByText('NEW THIS WEEK')).not.toBeInTheDocument();
      expect(screen.queryByText('Client Lifecycle Flow Chart')).not.toBeInTheDocument();

      // Verify reference client profiles and details
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
      expect(screen.getByText('Andheri West, Mumbai')).toBeInTheDocument();
      expect(screen.getByText('Budget: 45 Lakh')).toBeInTheDocument();
      expect(screen.getByText('RS')).toBeInTheDocument();

      expect(screen.getByText('Priya Patel')).toBeInTheDocument();
      expect(screen.getByText('Bandra East, Mumbai')).toBeInTheDocument();
      expect(screen.getByText('PP')).toBeInTheDocument();

      expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
      expect(screen.getByText('Lower Parel')).toBeInTheDocument();
      expect(screen.getByText('VS')).toBeInTheDocument();
    });
  });

  describe('Status Dropdown & Remarks Paragraph Features', () => {
    it('renders STATUS and REMARKS table headers and interactive status dropdown with all 5 options', () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      // Verify headers
      expect(screen.getByRole('columnheader', { name: 'STATUS' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'REMARKS' })).toBeInTheDocument();

      // Verify StatusDropdown options
      const selects = screen.getAllByTitle('Change visit status');
      expect(selects.length).toBeGreaterThan(0);

      const firstSelect = selects[0];
      const optionValues = Array.from(firstSelect.querySelectorAll('option')).map((o) => o.value);
      expect(optionValues).toEqual(['Visited', 'FollowUp', 'Revisited', 'Booked', 'Closed']);
    });

    it('allows changing visit status via dropdown and updates status', () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      const selects = screen.getAllByTitle('Change visit status');
      const firstSelect = selects[0]; // Rahul Sharma's status dropdown

      expect(firstSelect.value).toBe('Visited');

      // Change status to Booked
      fireEvent.change(firstSelect, { target: { value: 'Booked' } });
      expect(firstSelect.value).toBe('Booked');
    });

    it('displays remarks paragraph and allows inline editing of remarks paragraph', async () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      // Verify remark paragraph for Rahul Sharma is visible
      const remarkPara = screen.getByText(/Client showed keen interest in east-facing 2BHK/i);
      expect(remarkPara).toBeInTheDocument();
      expect(remarkPara).toHaveClass('remarks-para');

      // Click to edit
      fireEvent.click(remarkPara);

      // Check textarea appears with existing value
      const textarea = screen.getByPlaceholderText('Add remark paragraph...');
      expect(textarea).toBeInTheDocument();

      // Edit remark paragraph
      fireEvent.change(textarea, {
        target: { value: 'Client finalized 2BHK unit 402. Agreement draft sent.' }
      });

      // Click Save
      const saveBtn = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveBtn);

      // Check updated remark paragraph is displayed
      await waitFor(() => {
        expect(
          screen.getByText('Client finalized 2BHK unit 402. Agreement draft sent.')
        ).toBeInTheDocument();
      });
    });

    it('filters visits by status pills (Visited, FollowUp, Revisited, Booked, Closed)', () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      // Click "Booked" filter pill
      const bookedFilterBtn = screen.getByRole('button', { name: 'Booked' });
      fireEvent.click(bookedFilterBtn);

      // Sneha Reddy and Rajesh Khanna are Booked in seedVisits
      expect(screen.getByText('Sneha Reddy')).toBeInTheDocument();
      expect(screen.getByText('Rajesh Khanna')).toBeInTheDocument();
      // Rahul Sharma is Visited, so should not be in filtered list
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    });
  });

  describe('Interactive Quick Chips & Mobile Usability', () => {
    it('sets property and budget via quick-selection chips in visit form', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // Click "3BHK" chip
      const threeBhkChip = screen.getByRole('button', { name: '3BHK' });
      fireEvent.click(threeBhkChip);
      expect(threeBhkChip).toHaveClass('active');

      // Click "1.2 Cr" budget chip
      const budgetChip = screen.getByRole('button', { name: '1.2 Cr' });
      fireEvent.click(budgetChip);
      expect(budgetChip).toHaveClass('active');

      const budgetInput = screen.getByPlaceholderText('e.g. 50 Lakh / 1 Cr');
      expect(budgetInput.value).toBe('1.2 Cr');
    });

    it('shows search clear button and handles zero-result empty states', () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText('Search client, phone, remarks...');

      // Type query
      fireEvent.change(searchInput, { target: { value: 'NonExistentClient999' } });

      // Verify zero results empty state appears
      expect(screen.getByText('No matching visits found')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument();

      // Clear search via clear button
      const clearBtn = screen.getByTitle('Clear search');
      expect(clearBtn).toBeInTheDocument();
      fireEvent.click(clearBtn);

      // Verify table is restored
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
      expect(screen.queryByText('No matching visits found')).not.toBeInTheDocument();
    });

    it('renders sticky client name column and swipe guidance hint', () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText(/Swipe horizontally for phone, budget, status & remarks/i)).toBeInTheDocument();
      const stickyHeaders = screen.getAllByRole('columnheader').filter(h => h.classList.contains('sticky-cell'));
      expect(stickyHeaders.length).toBeGreaterThan(0);
    });
  });

  describe('Direct Call & WhatsApp Actions for Clients', () => {
    it('renders direct Call and WhatsApp action buttons on client cards with valid tel: and wa.me links', () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      // Verify Call buttons exist
      const callButtons = screen.getAllByRole('link', { name: /call/i });
      expect(callButtons.length).toBeGreaterThan(0);

      // Verify WhatsApp buttons exist
      const waButtons = screen.getAllByRole('link', { name: /whatsapp/i });
      expect(waButtons.length).toBeGreaterThan(0);

      // Verify specific links for Rahul Sharma (+91 98765 43210)
      const rahulCall = callButtons.find(btn => btn.getAttribute('href') === 'tel:+919876543210');
      expect(rahulCall).toBeDefined();

      const rahulWa = waButtons.find(btn => (btn.getAttribute('href') || '').includes('https://wa.me/919876543210'));
      expect(rahulWa).toBeDefined();
      expect(rahulWa).toHaveAttribute('target', '_blank');
      expect(rahulWa.getAttribute('href')).toContain(encodeURIComponent('Rahul Sharma'));
    });

    it('provides instant Call and WhatsApp action buttons in the All Visits table', () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      // Verify table phone cell has tel link
      const tableCallLinks = screen.getAllByRole('link').filter(a => (a.getAttribute('href') || '').startsWith('tel:'));
      expect(tableCallLinks.length).toBeGreaterThan(0);

      // Verify table phone cell has wa.me link
      const tableWaLinks = screen.getAllByRole('link').filter(a => (a.getAttribute('href') || '').startsWith('https://wa.me/'));
      expect(tableWaLinks.length).toBeGreaterThan(0);
    });

    it('allows searching clients and retaining direct Call and WhatsApp functionality', () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText('Search clients by name, phone, unit...');
      fireEvent.change(searchInput, { target: { value: 'Priya Patel' } });

      // Only Priya Patel should be visible
      expect(screen.getByText('Priya Patel')).toBeInTheDocument();
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();

      // Verify Priya's Call and WhatsApp links
      const priyaCall = screen.getByRole('link', { name: /call priya patel/i });
      expect(priyaCall).toHaveAttribute('href', 'tel:+918765432109');

      const priyaWa = screen.getByRole('link', { name: /whatsapp priya patel/i });
      expect(priyaWa.getAttribute('href')).toContain('https://wa.me/918765432109');
    });
  });

  describe('Dashboard Recent Filtering and Read-Only Status vs All Visits', () => {
    it('shows only visits from today and yesterday on Dashboard and displays read-only status', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Recent visits from today/yesterday should be visible
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
      expect(screen.getByText('Priya Patel')).toBeInTheDocument();
      expect(screen.getByText('Amit Verma')).toBeInTheDocument();
      expect(screen.getByText('Sneha Reddy')).toBeInTheDocument();

      // Older visits (3+ days ago) should NOT be on Dashboard
      expect(screen.queryByText('Rohan Mehta')).not.toBeInTheDocument();
      expect(screen.queryByText('Kavita Nair')).not.toBeInTheDocument();

      // In Dashboard, status dropdown SELECT must NOT be present
      expect(screen.queryByTitle('Change visit status')).not.toBeInTheDocument();

      // Read-only status badges should be present
      const readOnlyBadges = screen.getAllByTestId('status-badge-readonly');
      expect(readOnlyBadges.length).toBeGreaterThan(0);
      expect(readOnlyBadges[0]).toHaveTextContent(/Visited|FollowUp|Booked/i);
    });

    it('shows all visits and interactive status dropdown in All Visits view', () => {
      render(
        <MemoryRouter initialEntries={['/visits']}>
          <App />
        </MemoryRouter>
      );

      // In All Visits, both recent and older visits are shown
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
      expect(screen.getByText('Rohan Mehta')).toBeInTheDocument();
      expect(screen.getByText('Kavita Nair')).toBeInTheDocument();

      // Status dropdown SELECT MUST be present in All Visits
      const statusSelects = screen.getAllByTitle('Change visit status');
      expect(statusSelects.length).toBeGreaterThan(0);
    });
  });

  describe('Client Profile Cards in Clients View', () => {
    it('verifies status & remarks history section and flowcharts are completely removed from all client cards', () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      // Verify no flowchart or drawer elements exist on any client card
      expect(screen.queryByTestId('client-status-flow')).not.toBeInTheDocument();
      expect(screen.queryByTestId('client-flow-dropdown-panel')).not.toBeInTheDocument();
      expect(screen.queryByText(/Status & Remarks History/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Lifecycle Flowchart/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Click to View Remarks/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Click to View Flowchart/i)).not.toBeInTheDocument();
    });

    it('renders clean client cards with status badge and essential contact details', () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      const rahulCard = screen.getByTestId('client-card-1');
      expect(rahulCard).toBeInTheDocument();
      expect(rahulCard.querySelector('[data-testid="status-badge-readonly"]')).toHaveTextContent('Visited');
      expect(rahulCard).toHaveTextContent('Rahul Sharma');
      expect(rahulCard).toHaveTextContent('Andheri West, Mumbai');

      const snehaCard = screen.getByTestId('client-card-4');
      expect(snehaCard).toBeInTheDocument();
      expect(snehaCard.querySelector('[data-testid="status-badge-readonly"]')).toHaveTextContent('Booked');
      expect(snehaCard).toHaveTextContent('Sneha Reddy');
    });

    it('filters clients using pipeline status pills on the Clients screen', () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      // Click 'Booked' status filter pill
      const bookedPill = screen.getByRole('button', { name: /^Booked \(/i });
      fireEvent.click(bookedPill);

      // Only Booked clients should be visible
      expect(screen.getByText('Sneha Reddy')).toBeInTheDocument();
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();

      // Click 'Visited' status filter pill
      const visitedPill = screen.getByRole('button', { name: /^Visited \(/i });
      fireEvent.click(visitedPill);

      // Rahul Sharma should be visible now, Sneha Reddy should be filtered out
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
      expect(screen.queryByText('Sneha Reddy')).not.toBeInTheDocument();
    });

    it('displays latest remark callout box with note text on client card', () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      const rahulCard = screen.getByTestId('client-card-1');
      const remarkBox = rahulCard.querySelector('.client-flow-remark');
      expect(remarkBox).toBeInTheDocument();
      expect(remarkBox).toHaveTextContent('Latest Remark');
      expect(remarkBox).toHaveTextContent(/Loan eligibility check underway/i);
    });
  });

  describe("Admin & Sales Desk Dashboards - Removal of Workflow Tracker, Reminders & Shortcuts", () => {
    it("verifies CRM Operations Workflow Tracker, Reminders, Portfolio View, and 4 shortcuts are removed from Admin Dashboard", () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Workflow Tracker is completely removed from Admin Dashboard
      expect(screen.queryByTestId('workflow-section')).not.toBeInTheDocument();
      expect(screen.queryByText(/CRM Operations Workflow Tracker/i)).not.toBeInTheDocument();

      // Reminders section is removed
      expect(screen.queryByText(/Today's Action Reminders/i)).not.toBeInTheDocument();
      // Portfolio View bar is removed
      expect(screen.queryByText(/Portfolio View:/i)).not.toBeInTheDocument();
      // 4 shortcut cards are removed
      expect(screen.queryByText('New Client Visit Form')).not.toBeInTheDocument();
      expect(screen.queryByText('Visit Archives')).not.toBeInTheDocument();
      expect(screen.queryByText('Client Relationships')).not.toBeInTheDocument();
      expect(screen.queryByText('Performance & Analytics')).not.toBeInTheDocument();
      // "Record New Visit" and "Record Today's Visit" are removed
      expect(screen.queryByText(/Record New Visit/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Record Today's Visit/i)).not.toBeInTheDocument();
    });

    it("verifies CRM Operations Workflow Tracker is also removed from Property Sales Desk dashboards", () => {
      // Login as Veena Developer desk
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "vdpl-desk",
        role: "property",
        name: "VDPL Sales Lead",
        email: "desk@vdpl.com",
        property: "Veena Developer Pvt LTD"
      }));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Workflow tracker must NOT be present on sales desk dashboard
      expect(screen.queryByTestId('workflow-section')).not.toBeInTheDocument();
      expect(screen.queryByText(/CRM Operations Workflow Tracker/i)).not.toBeInTheDocument();
    });

    it("Park Solitaire sales desk can ONLY see Park Solitaire clients and visits, not other properties", () => {
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "ps-desk",
        role: "property",
        name: "Park Solitaire Desk Lead",
        email: "desk@parksolitaire.com",
        property: "Park Solitaire"
      }));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Sees Park Solitaire recent visit
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();

      // Does NOT see Veena Developer or Luxury Empire visits on Dashboard
      expect(screen.queryByText('Amit Verma')).not.toBeInTheDocument();
      expect(screen.queryByText('Manish Malhotra')).not.toBeInTheDocument();
    });

    it("Luxury Empire sales desk can ONLY see Luxury Empire clients and visits, not other properties", () => {
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "luxury-desk",
        role: "property",
        name: "Luxury Empire Lead",
        email: "desk@luxuryempire.com",
        property: "Luxury Empire"
      }));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Does NOT see Park Solitaire or Veena Developer visits
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
      expect(screen.queryByText('Amit Verma')).not.toBeInTheDocument();
      expect(screen.queryByText('Priya Patel')).not.toBeInTheDocument();
    });
  });

  describe('Multi-Property Architecture: Login, Separated Forms & Unified Admin Dashboard', () => {
    it('renders Multi-Property Operations Access Portal on /login with Property Desk and Master Admin tabs and NO 1-click demo section', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { level: 1, name: /Multi-Property Access/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Property Desk Login/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Master Admin Command/i })).toBeInTheDocument();

      // Verify the 4 properties are present
      expect(screen.getAllByText('Park Solitaire').length).toBeGreaterThan(0);
      expect(screen.getByText('Veena Developer Pvt LTD')).toBeInTheDocument();
      expect(screen.getByText('Luxury Empire')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();

      // Verify 1-Click Fast Access (Instant Launch) is REMOVED
      expect(screen.queryByText(/1-Click Fast Access/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Instant Launch/i)).not.toBeInTheDocument();
    });

    it('separates Visit Form and Dashboard for a specific property desk login (Veena Developer Pvt LTD)', async () => {
      // Simulate logging in as Veena Developer Pvt LTD Property Desk
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "veena-developer",
        role: "property",
        name: "Veena Developer Pvt LTD Desk",
        email: "desk@veena-developer.com",
        property: "Veena Developer Pvt LTD"
      }));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Verify header scope indicator displays Veena Developer Pvt LTD Desk
      expect(screen.getAllByText(/Veena Developer Pvt LTD Desk/i).length).toBeGreaterThan(0);

      // Navigate to Visit Form
      const newVisitBtn = screen.getAllByRole('link', { name: /New Visit/i })[0];
      fireEvent.click(newVisitBtn);

      // Verify dedicated property desk banner on Visit Form
      await waitFor(() => {
        expect(screen.getByText(/Veena Developer Pvt LTD — Dedicated Visit Desk/i)).toBeInTheDocument();
        expect(screen.getByText(/routed to Veena Developer Pvt LTD/i)).toBeInTheDocument();
      });

      // Fill in and submit the visit form for Veena Developer Pvt LTD
      const nameInput = screen.getByPlaceholderText('Enter first name');
      const phoneInput = screen.getByPlaceholderText('10-digit number');
      fireEvent.change(nameInput, { target: { value: 'Commercial Investor 01' } });
      fireEvent.change(phoneInput, { target: { value: '9822334455' } });

      const submitBtn = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitBtn);

      // Verify redirect to Dashboard and visit is listed
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument();
        expect(screen.getByText('Commercial Investor 01')).toBeInTheDocument();
      });
    });

    it('separates Visit Form and Dashboard for Park Solitaire desk login and displays new visit immediately on Park Solitaire Dashboard', async () => {
      // Simulate logging in as Park Solitaire Property Desk
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "park-solitaire",
        role: "property",
        name: "Park Solitaire Sales Desk",
        email: "desk@parksolitaire.com",
        property: "Park Solitaire"
      }));

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // Verify dedicated property desk banner on Visit Form
      expect(screen.getByText(/Park Solitaire — Dedicated Visit Desk/i)).toBeInTheDocument();
      expect(screen.getByText(/routed to Park Solitaire/i)).toBeInTheDocument();

      // Fill in and submit the visit form for Park Solitaire
      const nameInput = screen.getByPlaceholderText('Enter first name');
      const phoneInput = screen.getByPlaceholderText('10-digit number');
      fireEvent.change(nameInput, { target: { value: 'Aarav Singhania' } });
      fireEvent.change(phoneInput, { target: { value: '9819981998' } });

      const submitBtn = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitBtn);

      // Verify redirect to Park Solitaire Dashboard and visit is listed
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument();
        expect(screen.getByText('Park Solitaire Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Aarav Singhania')).toBeInTheDocument();
        expect(screen.getByText('+91 98199 81998')).toBeInTheDocument();
      });
    });

    it('separates Visit Form and Dashboard for Luxury Empire desk login and displays new visit immediately on Luxury Empire Dashboard without going to Park Solitaire', async () => {
      // Simulate logging in as Luxury Empire Property Desk
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "luxury-empire",
        role: "property",
        name: "Luxury Empire Sales Desk",
        email: "desk@luxuryempire.com",
        property: "Luxury Empire"
      }));

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // Verify dedicated property desk banner on Visit Form
      expect(screen.getByText(/Luxury Empire — Dedicated Visit Desk/i)).toBeInTheDocument();
      expect(screen.getByText(/routed to Luxury Empire/i)).toBeInTheDocument();

      // Fill in and submit the visit form for Luxury Empire
      const nameInput = screen.getByPlaceholderText('Enter first name');
      const phoneInput = screen.getByPlaceholderText('10-digit number');
      fireEvent.change(nameInput, { target: { value: 'Rajveer Oberoi' } });
      fireEvent.change(phoneInput, { target: { value: '9877798777' } });

      const submitBtn = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitBtn);

      // Verify redirect to Luxury Empire Dashboard and visit is listed under Luxury Empire
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument();
        expect(screen.getByText('Luxury Empire Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Rajveer Oberoi')).toBeInTheDocument();
        expect(screen.getByText('+91 98777 98777')).toBeInTheDocument();
      });

      // Verify that Park Solitaire recent visits (like Rahul Sharma) are NOT on Luxury Empire Dashboard
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    });

    it('provides Master Admin unified access to all properties in one dashboard without portfolio bar and without property logo', () => {
      // Set Master Admin user
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "admin",
        role: "admin",
        name: "Master Admin",
        email: "admin@parksolitaire.com",
        property: "ALL"
      }));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Verify Portfolio View Switcher Bar is REMOVED as requested
      expect(screen.queryByText(/Portfolio View:/i)).not.toBeInTheDocument();
      // Verify Property logo is REMOVED on admin dashboard
      expect(screen.queryByAltText('Park Solitaire')).not.toBeInTheDocument();
      expect(screen.getByText('CRM Command')).toBeInTheDocument();
      expect(screen.getByText('Central Admin')).toBeInTheDocument();

      // Verify Workflow Tracker is REMOVED from Admin Dashboard as requested
      expect(screen.queryByTestId('workflow-section')).not.toBeInTheDocument();
      expect(screen.queryByText(/CRM Operations Workflow Tracker/i)).not.toBeInTheDocument();

      // Verify option of adding new visit is REMOVED from Admin Dashboard
      expect(screen.queryByRole('link', { name: /New Visit/i })).not.toBeInTheDocument();

      // Verify both Park Solitaire and Veena Developer Pvt LTD records exist in unified view
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument(); // Park Solitaire
      expect(screen.getByText('Amit Verma')).toBeInTheDocument(); // Veena Developer Pvt LTD
    });
  });

  describe('Centralized Admin Dashboard & Property Management', () => {
    beforeEach(() => {
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "admin",
        role: "admin",
        name: "Master Admin",
        email: "admin@parksolitaire.com",
        property: "ALL"
      }));
    });

    it('renders 5 centralized summary metric cards on Dashboard and removes comparison matrix', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Verify the 5 summary cards
      expect(screen.getByText('Total Clients')).toBeInTheDocument();
      expect(screen.getAllByText('Total Enquiries').length).toBeGreaterThan(0);
      expect(screen.getByText("Today's Site Visits")).toBeInTheDocument();
      expect(screen.getByText('Pending Follow-ups')).toBeInTheDocument();
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();

      // Verify property comparison section is REMOVED as requested
      expect(screen.queryByRole('heading', { level: 3, name: 'Property Performance & Comparison' })).not.toBeInTheDocument();
      expect(screen.queryByText('Enquiries & Bookings by Property')).not.toBeInTheDocument();
      expect(screen.queryByText('Pipeline Stage Breakdown')).not.toBeInTheDocument();
    });

    it('filters data when an individual property filter is selected in Clients view', () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      // Click on VDPL filter chip in Clients view
      const vdplTab = screen.getByRole('button', { name: /^VDPL/i });
      fireEvent.click(vdplTab);

      // Verify VDPL client is present
      expect(screen.getByText('Amit Verma')).toBeInTheDocument();
      // Park Solitaire client should not be in the VDPL filtered clients
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    });

    it('allows adding and editing client records on the Clients screen', async () => {
      render(
        <MemoryRouter initialEntries={['/clients']}>
          <App />
        </MemoryRouter>
      );

      // 1. Open Add Client modal
      const addClientBtn = screen.getByRole('button', { name: /add client/i });
      expect(addClientBtn).toBeInTheDocument();
      fireEvent.click(addClientBtn);

      expect(screen.getByRole('heading', { level: 3, name: 'Add New Client' })).toBeInTheDocument();

      // Fill in new client details
      const nameInput = screen.getByPlaceholderText(/e\.g\. Ramesh Kulkarni/i);
      const phoneInput = screen.getByPlaceholderText(/10-digit number/i);
      fireEvent.change(nameInput, { target: { value: 'Kailash Singhania' } });
      fireEvent.change(phoneInput, { target: { value: '9822233344' } });

      const submitAddBtn = screen.getByRole('button', { name: /Add Client Record/i });
      fireEvent.click(submitAddBtn);

      // Client should now appear in client directory
      await waitFor(() => {
        expect(screen.getByText('Kailash Singhania')).toBeInTheDocument();
      });

      // 2. Click Edit on Rahul Sharma
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons.length).toBeGreaterThan(0);
      fireEvent.click(editButtons[0]);

      expect(screen.getByRole('heading', { level: 3, name: 'Edit Client Record' })).toBeInTheDocument();
      const saveEditBtn = screen.getByRole('button', { name: /Save Client Changes/i });
      expect(saveEditBtn).toBeInTheDocument();
      fireEvent.click(saveEditBtn);
    });
  });

  describe('Site Visit Management (/site-visits)', () => {
    beforeEach(() => {
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "admin",
        role: "admin",
        name: "Master Admin",
        email: "admin@parksolitaire.com",
        property: "ALL"
      }));
    });

    it('renders Site Visits page with summary metrics, view tabs, and calendar view', () => {
      render(
        <MemoryRouter initialEntries={['/site-visits']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { level: 1, name: 'Site Visits' })).toBeInTheDocument();
      expect(screen.getByText('Total Scheduled Visits')).toBeInTheDocument();
      expect(screen.getByText("Today's Walkthroughs")).toBeInTheDocument();
      expect(screen.getByText('Completed Visits')).toBeInTheDocument();

      // View tabs
      expect(screen.getByRole('button', { name: /Calendar View/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Upcoming Visits/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Completed History/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /All Visits Table/i })).toBeInTheDocument();

      // Calendar days of week
      expect(screen.getByText('Sun')).toBeInTheDocument();
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('displays upcoming visits and allows opening reschedule modal', async () => {
      render(
        <MemoryRouter initialEntries={['/site-visits']}>
          <App />
        </MemoryRouter>
      );

      // Switch to Upcoming Visits tab
      const upcomingTab = screen.getByRole('button', { name: /Upcoming Visits/i });
      fireEvent.click(upcomingTab);

      // Check for seeded upcoming visits
      expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();
      expect(screen.getByText('Rajesh Singhania')).toBeInTheDocument();

      // Check actions
      const reschedBtns = screen.getAllByRole('button', { name: /Reschedule/i });
      expect(reschedBtns.length).toBeGreaterThan(0);
      fireEvent.click(reschedBtns[0]);

      // Verify modal
      expect(screen.getByRole('heading', { level: 3, name: 'Reschedule Site Visit' })).toBeInTheDocument();
    });

    it('displays completed visit history with feedback and follow-up alert', () => {
      render(
        <MemoryRouter initialEntries={['/site-visits']}>
          <App />
        </MemoryRouter>
      );

      // Switch to Completed History tab
      const completedTab = screen.getByRole('button', { name: /Completed History/i });
      fireEvent.click(completedTab);

      // Check completed client
      expect(screen.getByText('Dr. Sanjay Verma')).toBeInTheDocument();
      expect(screen.getAllByText(/Client Feedback & Discussion:/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Loved the double-height ceiling and duplex terrace/i)).toBeInTheDocument();
    });

    it('renders proper calendar navigation, month/year selector, and status key legend', () => {
      render(
        <MemoryRouter initialEntries={['/site-visits']}>
          <App />
        </MemoryRouter>
      );

      // Verify Status Key legend items
      expect(screen.getByText('Status Key:')).toBeInTheDocument();
      expect(screen.getAllByText('Scheduled').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Confirmed').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Rescheduled').length).toBeGreaterThan(0);

      // Month/Year selects
      expect(screen.getByRole('combobox', { name: /Select Month/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /Select Year/i })).toBeInTheDocument();

      // Weekday columns
      expect(screen.getByText('Sun')).toBeInTheDocument();
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
      expect(screen.getByText('Wed')).toBeInTheDocument();
      expect(screen.getByText('Thu')).toBeInTheDocument();
      expect(screen.getByText('Fri')).toBeInTheDocument();
      expect(screen.getByText('Sat')).toBeInTheDocument();
    });

    it('displays day inspector panel for selected date and allows opening schedule modal with that date', () => {
      render(
        <MemoryRouter initialEntries={['/site-visits']}>
          <App />
        </MemoryRouter>
      );

      // Verify day inspector header & schedule button
      expect(screen.getByRole('button', { name: /Schedule Visit on this Date/i })).toBeInTheDocument();

      // Click schedule on this date
      const scheduleBtn = screen.getByRole('button', { name: /Schedule Visit on this Date/i });
      fireEvent.click(scheduleBtn);

      // Modal opens
      expect(screen.getByRole('heading', { level: 3, name: 'Schedule Site Visit' })).toBeInTheDocument();
    });
  });

  describe('Property Dedicated Logos & Brand Isolation', () => {
    it('renders dedicated logos for Veena Developer Pvt LTD and Luxury Empire on /login cards', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );

      // Logo images rendered in login cards
      const vdplLogo = screen.getByAltText('Veena Developer Pvt LTD');
      expect(vdplLogo).toBeInTheDocument();
      expect(vdplLogo).toHaveAttribute('src', expect.stringContaining('vdpl-logo'));

      const luxuryLogo = screen.getByAltText('Luxury Empire');
      expect(luxuryLogo).toBeInTheDocument();
      expect(luxuryLogo).toHaveAttribute('src', expect.stringContaining('luxury-empire-logo'));

      const psLogo = screen.getAllByAltText('Park Solitaire');
      expect(psLogo.length).toBeGreaterThan(0);
    });

    it('displays Veena Developer logo when logged into Veena Developer Sales Desk', () => {
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "vdpl-desk",
        role: "property",
        name: "VDPL Lead",
        email: "desk@vdpl.com",
        property: "Veena Developer Pvt LTD"
      }));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      const sidebarBrand = screen.getByAltText('Veena Developer Pvt LTD');
      expect(sidebarBrand).toBeInTheDocument();
      expect(sidebarBrand).toHaveAttribute('src', expect.stringContaining('vdpl-logo'));
    });

    it('displays Luxury Empire logo when logged into Luxury Empire Sales Desk', () => {
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "luxury-desk",
        role: "property",
        name: "Luxury Lead",
        email: "desk@luxuryempire.com",
        property: "Luxury Empire"
      }));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      const sidebarBrand = screen.getByAltText('Luxury Empire');
      expect(sidebarBrand).toBeInTheDocument();
      expect(sidebarBrand).toHaveAttribute('src', expect.stringContaining('luxury-empire-logo'));
    });

    it('Admin dashboard maintains clean CRM Command brand without property logos', () => {
      localStorage.setItem("ps_current_user_v3", JSON.stringify({
        id: "admin",
        role: "admin",
        name: "Master Admin",
        email: "admin@parksolitaire.com",
        property: "ALL"
      }));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      // Should show CRM Command Central Admin in sidebar, NOT any property logo
      expect(screen.getByText('CRM Command')).toBeInTheDocument();
      expect(screen.getByText('Central Admin')).toBeInTheDocument();
      expect(screen.queryByAltText('Veena Developer Pvt LTD')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Luxury Empire')).not.toBeInTheDocument();
    });
  });
});



