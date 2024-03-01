document.addEventListener('DOMContentLoaded', function() {
    const wordsGrid = document.getElementById('wordsGrid');
    const level1 = document.getElementById('level1cb');
    const level2 = document.getElementById('level2cb');
    const level3 = document.getElementById('level3cb');
    const angercb = document.getElementById('angercb');
    const disgustcb = document.getElementById('disgustcb');
    const fearcb = document.getElementById('fearcb');
    const happycb = document.getElementById('happycb');
    const sadcb = document.getElementById('sadcb');
    const surprisecb = document.getElementById('surprisecb');
    const showDefinitionCheckbox = document.getElementById('showDefinition');
    const showExampleCheckbox = document.getElementById('showExample');
    const showLevelCheckbox = document.getElementById('showLevel');
    const colorizeCheckbox = document.getElementById('colorize');

    function createWordCard(wordData) {
        const card = document.createElement('div');
        card.classList.add('wordCard', wordData.type);
        if (!colorizeCheckbox.checked) card.classList.add('no-color');
        card.innerHTML = `
            <div class="word"><strong>${wordData.word}</strong></div>
            <div class="definition">${wordData.definition}</div>
            <div class="example">${wordData.example}</div>
            <div class="level" style="${showLevelCheckbox.checked ? '' : 'display: none;'}">${wordData.level}</div>
        `;
        card.addEventListener('click', () => {
            card.classList.toggle('excluded');
        });
        return card;
    }

    function updateVisibility() {
        document.querySelectorAll('.wordCard').forEach(card => {
            const definition = card.querySelector('.definition');
            const example = card.querySelector('.example');
            const level = card.querySelector('.level');
            definition.style.display = showDefinitionCheckbox.checked ? '' : 'none';
            example.style.display = showExampleCheckbox.checked ? '' : 'none';
            level.style.display = showLevelCheckbox.checked ? '' : 'none';
            if (!colorizeCheckbox.checked) {
                card.style.backgroundColor = 'white';
            }
        });
    }

    function fetchData() {
        console.log('fetchData');
        fetch('words.json')
            .then(response => response.json())
            .then(data => {
                updateGrid(data);
            })
            .catch(error => console.error('Error loading the JSON file:', error));
    }
    
    function getSelectedLevels() {
        const selectedCheckboxes = document.querySelectorAll('#levelFilter input[name="level"]:checked');
        const selectedLevels = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
        return selectedLevels;
    }

    function getSelectedTypes() {
        const selectedCheckboxes = document.querySelectorAll('#typeFilter input[name="type"]:checked')
        const selectedTypes = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
        return selectedTypes;
    }
    
    
    function updateGrid(data) {
        const selectedLevels = getSelectedLevels();
        const selectedTypes = getSelectedTypes();
        wordsGrid.innerHTML = '';
        data.filter(wordData =>
            (selectedLevels.length === 0 || selectedLevels.includes(wordData.level.toString())) &&
            (selectedTypes.length === 0 || selectedTypes.includes(wordData.type.toString()))
        ).forEach(wordData => {
            const card = createWordCard(wordData);
            wordsGrid.appendChild(card);
        });
        updateVisibility();
    }

    [level1cb, level2cb, level3cb, angercb, disgustcb, fearcb, happycb, sadcb, surprisecb].forEach(cb => cb.addEventListener('change', () => fetchData()));
    [showDefinitionCheckbox, showExampleCheckbox, showLevelCheckbox, colorizeCheckbox].forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            fetchData(); // Re-fetch data to apply the filter and display changes
        });
    });

    fetchData(); // Initial data fetch
});
