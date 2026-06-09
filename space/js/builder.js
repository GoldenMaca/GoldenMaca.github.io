// Rocket Builder
class Builder {
    constructor(game) {
        this.game = game;
        this.parts = [];
        this.selectedPart = null;
        this.selectedPartType = null;
        this.ghostPart = null;
        this.history = [];
        this.historyIndex = -1;
        this.stages = [{ id: 1, parts: [] }];
        
        this.initPartsPalette();
    }

    initPartsPalette() {
        const categories = ['command', 'fuel', 'engine', 'structural', 'aero'];
        
        for (const category of categories) {
            const container = document.querySelector(`.part-list[data-category="${category}"]`);
            if (!container) continue;

            const parts = getPartsByCategory(category);
            for (const part of parts) {
                const el = document.createElement('div');
                el.className = 'part-item';
                el.dataset.partId = part.id;
                el.innerHTML = `
                    <span class="part-icon">${part.icon}</span>
                    <span class="part-name">${part.name}</span>
                `;
                el.addEventListener('click', () => this.selectPartType(part.id));
                container.appendChild(el);
            }
        }
    }

    selectPartType(partId) {
        this.selectedPartType = partId;
        
        // Update UI
        document.querySelectorAll('.part-item').forEach(el => {
            el.classList.toggle('selected', el.dataset.partId === partId);
        });

        const part = getPart(partId);
        this.showNotification(`Selected: ${part.name}`, 'success');
    }

    handleClick(screenX, screenY) {
        if (!this.selectedPartType) return;

        const renderer = this.game.renderer;
        const worldPos = renderer.screenToWorld(screenX, screenY);
        
        // Snap to grid
        const gridX = Math.round(worldPos.x / CONSTANTS.GRID_SIZE);
        const gridY = Math.round(worldPos.y / CONSTANTS.GRID_SIZE);

        // Check if position is occupied
        if (this.isPositionOccupied(gridX, gridY)) {
            this.showNotification('Position occupied!', 'warning');
            return;
        }

        // Check attachment
        const part = getPart(this.selectedPartType);
        const canAttach = this.canAttachAt(gridX, gridY, part);
        
        if (this.parts.length > 0 && !canAttach) {
            this.showNotification('Must attach to existing part!', 'warning');
            return;
        }

        this.addPart(this.selectedPartType, gridX, gridY);
    }

    addPart(partId, gridX, gridY, rotation = 0) {
        const partData = getPart(partId);
        const part = {
            ...partData,
            gridX,
            gridY,
            rotation,
            worldX: gridX * CONSTANTS.GRID_SIZE,
            worldY: gridY * CONSTANTS.GRID_SIZE,
            decoupled: false,
            currentFuel: partData.fuelMass || partData.solidFuel || 0,
            selected: false
        };

        this.parts.push(part);
        this.saveState();
        this.updateStages();
        this.showNotification(`Added ${part.name}`, 'success');
    }

    removePart(part) {
        const idx = this.parts.indexOf(part);
        if (idx >= 0) {
            this.parts.splice(idx, 1);
            this.saveState();
            this.updateStages();
        }
    }

    isPositionOccupied(gridX, gridY) {
        for (const part of this.parts) {
            if (part.gridX === gridX && part.gridY === gridY) {
                return true;
            }
        }
        return false;
    }

    canAttachAt(gridX, gridY, part) {
        for (const ap of part.attachPoints) {
            const attachX = gridX + ap.x;
            const attachY = gridY + ap.y;
            
            for (const existingPart of this.parts) {
                if (existingPart.gridX === attachX && existingPart.gridY === attachY) {
                    return true;
                }
            }
        }
        return false;
    }

    getPartAt(gridX, gridY) {
        for (const part of this.parts) {
            if (part.gridX === gridX && part.gridY === gridY) {
                return part;
            }
        }
        return null;
    }

    rotateSelectedPart() {
        if (this.selectedPart) {
            this.selectedPart.rotation = (this.selectedPart.rotation + Math.PI / 2) % (Math.PI * 2);
            this.saveState();
        }
    }

    deleteSelectedPart() {
        if (this.selectedPart) {
            this.removePart(this.selectedPart);
            this.selectedPart = null;
        }
    }

    updateGhost(screenX, screenY) {
        if (!this.selectedPartType) {
            this.ghostPart = null;
            return;
        }

        const renderer = this.game.renderer;
        const worldPos = renderer.screenToWorld(screenX, screenY);
        const gridX = Math.round(worldPos.x / CONSTANTS.GRID_SIZE);
        const gridY = Math.round(worldPos.y / CONSTANTS.GRID_SIZE);

        const partData = getPart(this.selectedPartType);
        this.ghostPart = {
            ...partData,
            gridX,
            gridY,
            worldX: gridX * CONSTANTS.GRID_SIZE,
            worldY: gridY * CONSTANTS.GRID_SIZE
        };
    }

    updateStages() {
        // Group parts by decouplers
        this.stages = [{ id: 1, parts: [] }];
        let currentStage = 0;

        // Sort by Y position (bottom to top)
        const sortedParts = [...this.parts].sort((a, b) => a.gridY - b.gridY);

        for (const part of sortedParts) {
            if (part.type === 'decoupler' || part.type === 'radial-decoupler') {
                if (this.stages[currentStage].parts.length > 0) {
                    currentStage++;
                    this.stages.push({ id: currentStage + 1, parts: [] });
                }
            }
            this.stages[currentStage].parts.push(part);
        }

        this.renderStages();
    }

    renderStages() {
        const container = document.getElementById('stage-list');
        container.innerHTML = '';

        for (let i = this.stages.length - 1; i >= 0; i--) {
            const stage = this.stages[i];
            const el = document.createElement('div');
            el.className = 'stage-item';
            el.innerHTML = `
                <span class="stage-number">Stage ${stage.id}</span>
                <span>${stage.parts.length} parts</span>
            `;
            container.appendChild(el);
        }
    }

    addStage() {
        this.stages.push({ id: this.stages.length + 1, parts: [] });
        this.renderStages();
    }

    saveState() {
        // Remove future history
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Save current state
        this.history.push(this.parts.map(p => ({
            id: p.id,
            gridX: p.gridX,
            gridY: p.gridY,
            rotation: p.rotation
        })));
        
        this.historyIndex++;
        
        // Limit history
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    restoreState(state) {
        this.parts = state.map(p => {
            const partData = getPart(p.id);
            return {
                ...partData,
                ...p,
                worldX: p.gridX * CONSTANTS.GRID_SIZE,
                worldY: p.gridY * CONSTANTS.GRID_SIZE,
                decoupled: false,
                currentFuel: partData.fuelMass || partData.solidFuel || 0,
                selected: false
            };
        });
        this.updateStages();
    }

    clearRocket() {
        this.parts = [];
        this.selectedPart = null;
        this.ghostPart = null;
        this.stages = [{ id: 1, parts: [] }];
        this.saveState();
        this.renderStages();
        this.showNotification('Rocket cleared', 'warning');
    }

    saveRocket() {
        const data = JSON.stringify(this.parts.map(p => ({
            id: p.id,
            gridX: p.gridX,
            gridY: p.gridY,
            rotation: p.rotation
        })));
        localStorage.setItem('savedRocket', data);
        this.showNotification('Rocket saved!', 'success');
    }

    loadRocket() {
        const data = localStorage.getItem('savedRocket');
        if (data) {
            try {
                const parts = JSON.parse(data);
                this.restoreState(parts);
                this.saveState();
                this.showNotification('Rocket loaded!', 'success');
            } catch (e) {
                this.showNotification('Failed to load rocket', 'error');
            }
        } else {
            this.showNotification('No saved rocket found', 'warning');
        }
    }

    buildRocket() {
        if (this.parts.length === 0) return null;

        // Create rocket from parts
        const rocket = new Rocket();
        rocket.parts = this.parts.map(p => ({
            ...getPart(p.id),
            gridX: p.gridX,
            gridY: p.gridY,
            worldX: p.worldX,
            worldY: p.worldY,
            rotation: p.rotation,
            decoupled: false,
            currentFuel: getPart(p.id).fuelMass || getPart(p.id).solidFuel || 0
        }));

        rocket.initFuel();
        rocket.buildStages();
        rocket.calculateMass();

        return rocket;
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const el = document.createElement('div');
        el.className = `notification ${type}`;
        el.textContent = message;
        container.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 3000);
    }

    update(justClicked) {
        if (justClicked && this.game.mode === 'builder') {
            this.handleClick(this.game.controls.mouse.x, this.game.controls.mouse.y);
        }

        // Update ghost
        this.updateGhost(this.game.controls.mouse.x, this.game.controls.mouse.y);

        // Handle part selection (on drag)
        if (this.game.controls.mouse.down && !justClicked) {
            const renderer = this.game.renderer;
            const worldPos = renderer.screenToWorld(
                this.game.controls.mouse.x,
                this.game.controls.mouse.y
            );
            const gridX = Math.round(worldPos.x / CONSTANTS.GRID_SIZE);
            const gridY = Math.round(worldPos.y / CONSTANTS.GRID_SIZE);
            
            const part = this.getPartAt(gridX, gridY);
            if (part && this.selectedPart !== part) {
                if (this.selectedPart) this.selectedPart.selected = false;
                this.selectedPart = part;
                part.selected = true;
            }
        }
    }

    render() {
        this.game.renderer.drawBuilderGrid();
        this.game.renderer.drawBuilderRocket(this.parts, this.ghostPart);
    }
}


