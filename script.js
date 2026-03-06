/* script.js - Advanced Pathfinding & Performance Optimized */
if (!localStorage.getItem('pmCurrentUser')) window.location.href = "index.html";

const TOTAL = 1300;
const COLS = 50; // Grid columns for coordinate calculation

// ALGORITHM: Manhattan Distance Heuristic
// Formula: d = |x1 - x2| + |y1 - y2|
function calculateRoute(targetSlot) {
    const x1 = 0, y1 = 0; // Entrance Coordinates
    const x2 = (targetSlot - 1) % COLS;
    const y2 = Math.floor((targetSlot - 1) / COLS);
    
    const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    const zone = String.fromCharCode(65 + Math.floor((targetSlot - 1) / 50));
    
    return {
        dist: distance,
        eta: (distance * 0.2).toFixed(1) + " mins",
        zone: zone
    };
}

function init() {
    const grid = document.getElementById("grid");
    if(!grid) return; 
    
    const booked = JSON.parse(localStorage.getItem('bookedSlots')) || [];
    const ticket = JSON.parse(localStorage.getItem('activeTicket'));
    const mySlot = ticket ? parseInt(ticket.slot) : null;
    let free = 0;

    // DATA STRUCTURE: DocumentFragment for O(1) DOM Insertion performance
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= TOTAL; i++) {
        const el = document.createElement("div");
        let status = booked.includes(i) ? 'occupied' : 'free';
        if (i === mySlot) status = 'my-slot';

        el.className = `slot ${status}`;
        el.title = `Slot ${i}`;

        if (status === 'free') {
            free++;
            el.onclick = () => {
                if(mySlot) {
                    Swal.fire('Limit Reached', 'You already have an active booking.', 'warning');
                } else {
                    const route = calculateRoute(i);
                    Swal.fire({
                        title: `Confirm Slot #${i}`,
                        html: `<b>Zone:</b> ${route.zone}<br><b>Distance:</b> ${route.dist} units<br><b>ETA:</b> ${route.eta}`,
                        showCancelButton: true,
                        confirmButtonText: 'Navigate & Book'
                    }).then(res => {
                        if(res.isConfirmed) window.location.href = `token.html?slot=${i}`;
                    });
                }
            };
        }
        fragment.appendChild(el);
    }
    grid.innerHTML = "";
    grid.appendChild(fragment);
    
    document.getElementById('freeC').innerText = free;
    document.getElementById('occC').innerText = TOTAL - free;
}

window.onload = init;