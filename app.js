// Database Config
const SUPABASE_URL = 'https://xornzelybefhpcpfrmhl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UZD-UWg94FObGgah7XbyUA_64-1uj9M';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const CURRENT_USER = 'SW-1052'; // Rajesh Kumar

const api = {
    async loadAll() {
        const { data: user } = await _supabase.from('customers').select('*').eq('user_id', CURRENT_USER).single();
        if (user) this.renderUI(user);
        this.fetchTickets();
        this.fetchPayments();
    },

    renderUI(user) {
        document.getElementById('user-welcome').innerText = "Hello, " + user.full_name;
        document.getElementById('plan-name').innerText = user.current_plan;
        document.getElementById('balance-display').innerText = "₹" + user.current_balance;
        document.getElementById('expiry-date').innerText = "Expires: " + user.plan_expiry;
        
        // Show Pay Now only if there's a balance
        const payBtn = document.getElementById('pay-btn');
        if(user.current_balance > 0) payBtn.classList.remove('hidden');
        else payBtn.classList.add('hidden');
    },

    async fetchTickets() {
        const { data } = await _supabase.from('tickets').select('*').eq('customer_id', CURRENT_USER).order('id', {ascending: false});
        document.getElementById('ticket-list').innerHTML = data.map(t => `
            <div class="item-row">
                <span><strong>${t.ticket_number}</strong><br><small>${t.category}</small></span>
                <span class="badge ${t.ticket_status.toLowerCase().replace(' ', '')}">${t.ticket_status}</span>
            </div>
        `).join('') || 'No tickets';
    },

    async fetchPayments() {
        const { data } = await _supabase.from('payments').select('*').eq('customer_id', CURRENT_USER);
        document.getElementById('payment-list').innerHTML = data.map(p => `
            <div class="item-row">
                <span><strong>₹${p.amount_paid}</strong><br><small>${p.payment_date}</small></span>
                <a href="${p.invoice_link}" target="_blank" style="color:var(--teal);"><i class="fas fa-file-invoice"></i></a>
            </div>
        `).join('') || 'No history found';
    },

    async upgradePlan() {
        const plan = document.getElementById('new-plan-id').value;
        const { error } = await _supabase.from('customers').update({ current_plan: plan }).eq('user_id', CURRENT_USER);
        if (!error) { 
            alert("Plan upgraded successfully!"); 
            this.loadAll(); 
            toggleDrawer('upgrade-drawer'); 
        }
    },

    async submitTicket() {
        const desc = document.getElementById('ticket-desc').value;
        const cat = document.getElementById('ticket-category').value;
        if(!desc) return alert("Please enter details.");

        const { error } = await _supabase.from('tickets').insert([{
            ticket_number: "CR-" + Math.floor(1000+Math.random()*9000),
            customer_id: CURRENT_USER,
            category: cat,
            problem_desc: desc,
            ticket_status: 'Open'
        }]);
        if (!error) { 
            alert("Ticket Raised!"); 
            document.getElementById('ticket-desc').value = '';
            this.fetchTickets(); 
            toggleDrawer('complaint-drawer'); 
        }
    },

    async requestCashCollection() {
        const { error } = await _supabase.from('tickets').insert([{
            ticket_number: "PAY-" + Math.floor(1000+Math.random()*9000),
            customer_id: CURRENT_USER,
            category: 'Cash Collection',
            problem_desc: 'User requested home visit for cash payment.',
            ticket_status: 'Open'
        }]);
        if (!error) {
            alert("Cash pick-up request sent!");
            this.fetchTickets();
        }
    },

    openWhatsApp() {
        window.open('https://wa.me/91XXXXXXXXXX?text=Hi Speedworld, I need support.');
    }
};

// UI Helper
function toggleDrawer(id) {
    document.getElementById(id).classList.toggle('hidden');
}

function handlePayment() {
    alert("Opening payment gateway...");
}

// Boot the app
api.loadAll();
