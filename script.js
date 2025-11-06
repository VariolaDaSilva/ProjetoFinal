// Array global para armazenar os itens
let allItems = [];
let filteredItems = [];

// Função para carregar os dados do JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar dados');
        }
        const data = await response.json();
        allItems = data.items;
        filteredItems = allItems;
        displayItems(filteredItems);
        updateItemCount(filteredItems.length);
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('catalog').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="color: #e74c3c; font-size: 1.2rem;">❌ Erro ao carregar os itens</p>
                <p style="color: #95a5a6;">Verifique se o arquivo data.json está presente</p>
            </div>
        `;
    }
}

// Função para exibir os itens no catálogo
function displayItems(items) {
    const catalog = document.getElementById('catalog');
    const noResults = document.getElementById('noResults');
    
    if (items.length === 0) {
        catalog.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    catalog.style.display = 'grid';
    noResults.style.display = 'none';
    
    catalog.innerHTML = items.map(item => `
        <div class="item-card" onclick="showItemDetails(${item.id})">
            <div class="item-icon">${item.icon}</div>
            <h3 class="item-name">${item.name}</h3>
            <div>
                <span class="item-category">${item.category}</span>
                <span class="item-rarity rarity-${item.rarity.toLowerCase()}">${item.rarity}</span>
            </div>
            <p class="item-description">${item.description}</p>
        </div>
    `).join('');
}

// Função para atualizar o contador de itens
function updateItemCount(count) {
    const itemCount = document.getElementById('itemCount');
    if (itemCount) {
        itemCount.textContent = `Exibindo ${count} ${count === 1 ? 'item' : 'itens'}`;
    }
}

// Função para filtrar os itens
function filterItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const rarityFilter = document.getElementById('rarityFilter').value;
    
    filteredItems = allItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                            item.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesRarity = rarityFilter === 'all' || item.rarity === rarityFilter;
        
        return matchesSearch && matchesCategory && matchesRarity;
    });
    
    displayItems(filteredItems);
    updateItemCount(filteredItems.length);
}

// Função para mostrar detalhes do item no modal
function showItemDetails(itemId) {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;
    
    const modal = document.getElementById('itemModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-icon">${item.icon}</div>
        <h2 class="modal-title">${item.name}</h2>
        <div style="text-align: center; margin-bottom: 1rem;">
            <span class="item-category">${item.category}</span>
            <span class="item-rarity rarity-${item.rarity.toLowerCase()}">${item.rarity}</span>
        </div>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">${item.description}</p>
        
        <div class="modal-stats">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">📊 Estatísticas</h3>
            ${item.damage ? `
                <div class="stat-row">
                    <span><strong>💥 Dano:</strong></span>
                    <span>${item.damage}</span>
                </div>
            ` : ''}
            ${item.defense ? `
                <div class="stat-row">
                    <span><strong>🛡️ Defesa:</strong></span>
                    <span>+${item.defense}</span>
                </div>
            ` : ''}
            ${item.speed ? `
                <div class="stat-row">
                    <span><strong>⚡ Velocidade:</strong></span>
                    <span>${item.speed}</span>
                </div>
            ` : ''}
            ${item.mining ? `
                <div class="stat-row">
                    <span><strong>⛏️ Poder de Mineração:</strong></span>
                    <span>${item.mining}%</span>
                </div>
            ` : ''}
            ${item.duration ? `
                <div class="stat-row">
                    <span><strong>⏱️ Duração:</strong></span>
                    <span>${item.duration}</span>
                </div>
            ` : ''}
            ${item.effect ? `
                <div class="stat-row">
                    <span><strong>✨ Efeito:</strong></span>
                    <span>${item.effect}</span>
                </div>
            ` : ''}
        </div>
        
        ${item.howToGet ? `
            <div style="background: var(--bg-color); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">📍 Como Obter:</h4>
                <p style="color: var(--text-muted);">${item.howToGet}</p>
            </div>
        ` : ''}
    `;
    
    modal.style.display = 'block';
}

// Função para resetar filtros
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('rarityFilter').value = 'all';
    filterItems();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Carrega os dados quando a página é carregada
    loadData();
    
    // Event listener para a pesquisa
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }
    
    // Event listeners para os filtros
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterItems);
    }
    
    const rarityFilter = document.getElementById('rarityFilter');
    if (rarityFilter) {
        rarityFilter.addEventListener('change', filterItems);
    }
    
    // Event listener para o botão de reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Event listeners para o modal
    const modal = document.getElementById('itemModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Fecha o modal com a tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});