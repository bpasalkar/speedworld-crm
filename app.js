const CURRENT_USER_ID = 'SW-1052';

const api = {
    userData: null,

    async init() {
        const { data, error } = await _supabase.from('customers').select('*').eq('user_id', CURRENT_USER_ID).single();
        if (data) {
            this.userData = data;
            this.renderHome();
        }
    },

    renderHome() {
        document.getElementById('user-name').innerText = this.userData.full_name;
        document.getElementById('plan-name').innerText = this.userData.current_plan;
        
        // Check for Dues [XXX]
        if (this.userData.current_balance > 0) {
            const duesBox = document.getElementById('dues-section');
            duesBox.classList.remove('hidden');
            document.getElementById('due-amount').innerText = "₹" + this.userData.current_balance;
        }
    },

    // Renewal Logic [XXXII]
    openRenewal() {
        if (this.userData.current_balance > 0) {
            alert("Renewal Blocked: Please clear your outstanding dues of ₹" + this.userData.current_balance + " first.");
            this.openBilling(); // Redirect to payment
        } else {
            // Proceed to Renewal Screen [XXXVII]
            console.log("Opening Renewal Screen...");
        }
    },

    // Troubleshooting Questionnaire Placeholder [XL]
    startTroubleshooting(category) {
        console.log("Loading questions for:", category);
        // Step 1: "Is your router power light ON?"
        // Step 2: "Have you restarted the device?"
        // If unresolved -> proceed to submitTicket()
    }
};

// Start the app
api.init();
