// Array global para armazenar os chefes
let allBosses = [];
let filteredBosses = [];

// Função para carregar os dados do JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar dados');
        }
        const data = await response.json();
        allBosses = data.bosses;
        filteredBosses = allBosses;
        displayBosses(filteredBosses);
        updateBossCount(filteredBosses.length);
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('bossCatalog').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="color: #e74c3c; font-size: 1.2rem;">Erro ao carregar os chefes</p>
                <p style="color: #95a5a6;">Verifique se o arquivo data.json está presente</p>
            </div>
        `;
    }
}

// Função para renderizar ícone (imagem)
function renderIcon(icon, bossName) {
    
    const imageName = bossName.toLowerCase()
        .replace(/ /g, '-')           
        .replace(/'/g, '')            
        .replace(/\(.*?\)/g, '')      
        .trim();
    
    const imagePath = `imagens/${imageName}.png`;
    
    
    return `<img src="${imagePath}" alt="${bossName}" onerror="this.style.display='none'; this.parentElement.innerHTML='${icon}'">`;
}

// Função para exibir os chefes no catálogo
function displayBosses(bosses) {
    const catalog = document.getElementById('bossCatalog');
    const noResults = document.getElementById('noResults');
    
    if (bosses.length === 0) {
        catalog.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    catalog.style.display = 'grid';
    noResults.style.display = 'none';
    
    catalog.innerHTML = bosses.map(boss => `
        <div class="item-card" onclick="showBossDetails(${boss.id})">
            <div class="boss-order">${boss.order}</div>
            <div class="item-icon">${renderIcon(boss.icon, boss.name)}</div>
            <h3 class="item-name">${boss.name}</h3>
            <div style="text-align: center;">
                <span class="item-difficulty difficulty-${boss.difficulty.toLowerCase().replace('-', '-')}">${boss.difficulty}</span>
            </div>
            <p class="item-description">${boss.description}</p>
            <div class="summon-info">
                <strong>Invocação:</strong>
                ${boss.summon}
            </div>
        </div>
    `).join('');
}

// Função para atualizar o contador de chefes
function updateBossCount(count) {
    const bossCount = document.getElementById('bossCount');
    if (bossCount) {
        bossCount.textContent = `Exibindo ${count} ${count === 1 ? 'chefe' : 'chefes'}`;
    }
}

// Função para filtrar os chefes
function filterBosses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const difficultyFilter = document.getElementById('difficultyFilter').value;
    const orderFilter = document.getElementById('orderFilter').value;
    
    filteredBosses = allBosses.filter(boss => {
        const matchesSearch = boss.name.toLowerCase().includes(searchTerm) || 
                            boss.description.toLowerCase().includes(searchTerm) ||
                            boss.summon.toLowerCase().includes(searchTerm);
        const matchesDifficulty = difficultyFilter === 'all' || boss.difficulty === difficultyFilter;
        
        return matchesSearch && matchesDifficulty;
    });
    
   
    if (orderFilter === 'alphabetical') {
        filteredBosses.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        filteredBosses.sort((a, b) => a.order - b.order);
    }
    
    displayBosses(filteredBosses);
    updateBossCount(filteredBosses.length);
}

// Função para mostrar detalhes do chefe no modal
function showBossDetails(bossId) {
    const boss = allBosses.find(b => b.id === bossId);
    if (!boss) return;
    
    const modal = document.getElementById('bossModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-icon">${renderIcon(boss.icon, boss.name)}</div>
        <h2 class="modal-title">${boss.name}</h2>
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <span class="item-difficulty difficulty-${boss.difficulty.toLowerCase().replace('-', '-')}">${boss.difficulty}</span>
            <span style="display: inline-block; margin-left: 1rem; background: var(--primary-color); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem;">
                #${boss.order} na Progressão
            </span>
        </div>
        
        <p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center; font-size: 1.1rem;">${boss.description}</p>
        
        <div class="summon-box">
            <h4>Como Invocar</h4>
            <p style="color: var(--text-color); line-height: 1.6;">${boss.summon}</p>
        </div>
        
        <div class="modal-stats">
            <h3>Informações de Combate</h3>
            ${boss.health ? `
                <div class="stat-row">
                    <span><strong>Vida:</strong></span>
                    <span>${boss.health}</span>
                </div>
            ` : ''}
            ${boss.defense ? `
                <div class="stat-row">
                    <span><strong>Defesa:</strong></span>
                    <span>${boss.defense}</span>
                </div>
            ` : ''}
            ${boss.damage ? `
                <div class="stat-row">
                    <span><strong>⚔️ Dano (Contato):</strong></span>
                    <span>${boss.damage}</span>
                </div>
            ` : ''}
        </div>
        
        ${boss.tips ? `
            <div style="background: rgba(139, 38, 53, 0.1); padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; border-left: 4px solid var(--primary-color);">
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Dicas de Combate</h4>
                <p style="color: var(--text-color); line-height: 1.6;">${boss.tips}</p>
            </div>
        ` : ''}
        
        ${boss.rewards ? `
            <div style="background: var(--bg-color); padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; border: 1px solid rgba(139, 38, 53, 0.3);">
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Recompensas Principais</h4>
                <p style="color: var(--text-muted); line-height: 1.6;">${boss.rewards}</p>
            </div>
        ` : ''}
    `;
    
    modal.style.display = 'block';
}

// Função para resetar filtros
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('difficultyFilter').value = 'all';
    document.getElementById('orderFilter').value = 'progression';
    filterBosses();
}


document.addEventListener('DOMContentLoaded', function() {
    loadData();
    

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterBosses);
    }
    
   
    const difficultyFilter = document.getElementById('difficultyFilter');
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterBosses);
    }
    
    const orderFilter = document.getElementById('orderFilter');
    if (orderFilter) {
        orderFilter.addEventListener('change', filterBosses);
    }
    
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    

    const modal = document.getElementById('bossModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
   
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
 
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

});
