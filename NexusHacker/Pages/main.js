class NexusHacker {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.startTime = Date.now();
        this.hackedNodes = 0;
        this.totalNodes = 36;
        this.gameState = 'ready';
        this.targetNode = null;
        this.securityLevel = 100;
        this.commands = {
            'help': this.showHelp.bind(this),
            'scan': this.scanNetwork.bind(this),
            'hack': this.quickHack.bind(this),
            'status': this.showStatus.bind(this),
            'clear': this.clearTerminal.bind(this),
            'exit': this.emergencyExit.bind(this),
            'virus': this.deployVirus.bind(this),
            'reset': this.resetSystem.bind(this)
        };
        
        this.init();
    }

    init() {
        this.createParticles();
        this.setupCursor();
        this.generateNetwork();
        this.setupTerminal();
        this.updateStats();
        this.startGameLoop();
        
        setTimeout(() => this.addTerminalMessage('[SYSTEM] All systems operational', 'var(--neon-green)'), 1000);
        setTimeout(() => this.addTerminalMessage('[AI] Type "help" for available commands', 'var(--neon-blue)'), 2000);
    }

    createParticles() {
        const container = document.querySelector('.particle-container');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            container.appendChild(particle);
        }
    }

    setupCursor() {
        const cursor = document.querySelector('.cursor');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        document.addEventListener('mousedown', () => cursor.classList.add('active'));
        document.addEventListener('mouseup', () => cursor.classList.remove('active'));
    }

    generateNetwork() {
        const grid = document.getElementById('networkGrid');
        grid.innerHTML = '';
        
        for (let i = 0; i < this.totalNodes; i++) {
            const node = document.createElement('div');
            node.className = 'network-node';
            node.dataset.id = i;
            node.textContent = i.toString(16).toUpperCase().padStart(2, '0');
            node.addEventListener('click', () => this.hackNode(i));
            grid.appendChild(node);
        }
        
        this.setRandomTarget();
    }

    setRandomTarget() {
        const nodes = document.querySelectorAll('.network-node:not(.hacked):not(.secured)');
        if (nodes.length === 0) {
            this.levelComplete();
            return;
        }
        
        if (this.targetNode !== null) {
            const oldTarget = document.querySelector(`[data-id="${this.targetNode}"]`);
            if (oldTarget) oldTarget.classList.remove('target');
        }
        
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        this.targetNode = parseInt(randomNode.dataset.id);
        randomNode.classList.add('target');
        
        this.addTerminalMessage(`[TARGET] Node ${this.targetNode.toString(16).toUpperCase().padStart(2, '0')} marked for infiltration`, 'var(--neon-pink)');
    }

    hackNode(nodeId) {
        const node = document.querySelector(`[data-id="${nodeId}"]`);
        
        if (node.classList.contains('hacked') || node.classList.contains('secured')) {
            this.addTerminalMessage(`[ERROR] Node ${nodeId.toString(16).toUpperCase().padStart(2, '0')} is inaccessible`, 'var(--warning-red)');
            return;
        }
        
        const isTarget = nodeId === this.targetNode;
        const hackSuccess = isTarget ? true : Math.random() > 0.3 + (this.securityLevel / 200);
        
        if (hackSuccess) {
            node.classList.add('hacked');
            node.classList.remove('target');
            this.hackedNodes++;
            
            const points = isTarget ? 100 : 50;
            this.score += points;
            
            this.addTerminalMessage(`[SUCCESS] Node ${nodeId.toString(16).toUpperCase().padStart(2, '0')} compromised (+${points} points)`, 'var(--neon-green)');
            
            if (isTarget) {
                this.setRandomTarget();
            }
            
            this.updateSecurity();
        } else {
            const penalty = Math.random() > 0.5;
            if (penalty) {
                node.classList.add('secured');
                this.addTerminalMessage(`[DETECTED] Node ${nodeId.toString(16).toUpperCase().padStart(2, '0')} secured by countermeasures`, 'var(--warning-red)');
                this.securityLevel += 10;
            } else {
                this.addTerminalMessage(`[FAILED] Hack attempt on node ${nodeId.toString(16).toUpperCase().padStart(2, '0')} unsuccessful`, 'var(--neon-blue)');
            }
        }
        
        this.updateStats();
        this.updateSecurityBars();
    }

    updateSecurity() {
        this.securityLevel = Math.max(0, this.securityLevel - 2);
        
        if (this.hackedNodes % 5 === 0 && this.hackedNodes > 0) {
            this.addTerminalMessage('[SYSTEM] Security protocols adapting...', 'var(--neon-pink)');
            this.securityLevel += 15;
        }
    }

    levelComplete() {
        this.level++;
        this.addTerminalMessage(`[LEVEL UP] Level ${this.level} initiated`, 'var(--neon-green)');
        this.addTerminalMessage('[SYSTEM] Generating new network topology...', 'var(--neon-blue)');
        
        setTimeout(() => {
            this.hackedNodes = 0;
            this.securityLevel = 100 + (this.level * 10);
            this.generateNetwork();
            this.updateStats();
            this.updateSecurityBars();
        }, 2000);
    }

    setupTerminal() {
        const input = document.getElementById('terminalInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim().toLowerCase();
                this.executeCommand(command);
                input.value = '';
            }
        });
    }

    executeCommand(command) {
        this.addTerminalMessage(`nexus@hacker:~$ ${command}`, 'var(--terminal-green)');
        
        if (this.commands[command]) {
            this.commands[command]();
        } else {
            this.addTerminalMessage(`[ERROR] Command '${command}' not recognized. Type 'help' for available commands.`, 'var(--warning-red)');
        }
    }

    showHelp() {
        const helpText = [
            '[HELP] Available Commands:',
            'help     - Show this help message',
            'scan     - Scan network for vulnerabilities',
            'hack     - Quick hack attempt on random node',
            'virus    - Deploy virus payload',
            'status   - Show system status',
            'clear    - Clear terminal output',
            'reset    - Reset the system',
            'exit     - Emergency disconnect'
        ];
        helpText.forEach(line => this.addTerminalMessage(line, 'var(--neon-blue)'));
    }

    quickHack() {
        const availableNodes = document.querySelectorAll('.network-node:not(.hacked):not(.secured)');
        if (availableNodes.length === 0) {
            this.addTerminalMessage('[INFO] No available nodes to hack.', 'var(--neon-pink)');
            return;
        }
        const randomNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
        this.hackNode(parseInt(randomNode.dataset.id));
    }

    scanNetwork() {
        this.addTerminalMessage('[SCAN] Scanning network...', 'var(--neon-blue)');
        setTimeout(() => {
            this.addTerminalMessage(`[SCAN COMPLETE] ${this.totalNodes - this.hackedNodes} nodes remain.`, 'var(--neon-green)');
        }, 1000);
    }

    deployVirus() {
        this.addTerminalMessage('[VIRUS] Deploying virus payload...', 'var(--warning-red)');
        setTimeout(() => {
            this.score += 200;
            this.addTerminalMessage('[VIRUS DEPLOYED] Network disruption successful. (+200 points)', 'var(--neon-green)');
            this.updateStats();
        }, 1500);
    }

    showStatus() {
        this.addTerminalMessage(`[STATUS] Level: ${this.level}, Score: ${this.score}, Hacked: ${this.hackedNodes}/${this.totalNodes}`, 'var(--neon-blue)');
    }

    clearTerminal() {
        const output = document.getElementById('terminalOutput');
        output.innerHTML = '';
    }

    emergencyExit() {
        this.addTerminalMessage('[EXIT] Emergency exit initiated. Disconnecting...', 'var(--warning-red)');
        setTimeout(() => window.location.reload(), 1500);
    }

    resetSystem() {
        this.addTerminalMessage('[RESET] Resetting system...', 'var(--neon-pink)');
        setTimeout(() => {
            this.level = 1;
            this.score = 0;
            this.hackedNodes = 0;
            this.securityLevel = 100;
            this.generateNetwork();
            this.updateStats();
            this.updateSecurityBars();
            this.addTerminalMessage('[SYSTEM] Reset complete.', 'var(--neon-green)');
        }, 1500);
    }

    addTerminalMessage(message, color) {
        const output = document.getElementById('terminalOutput');
        const div = document.createElement('div');
        div.style.color = color;
        div.textContent = message;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    updateStats() {
        document.getElementById('level').textContent = this.level;
        document.getElementById('score').textContent = this.score;
        document.getElementById('hacked').textContent = `${this.hackedNodes}/${this.totalNodes}`;
    }

    updateSecurityBars() {
        const firewall = document.getElementById('firewallProgress');
        firewall.style.width = `${this.securityLevel}%`;
        document.getElementById('firewallText').textContent = `${this.securityLevel}%`;
    }

    startGameLoop() {
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
            const seconds = String(elapsed % 60).padStart(2, '0');
            document.getElementById('time').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
}

let game;

window.addEventListener("DOMContentLoaded", () => {
   game = new NexusHacker();

    window.startHack = () => game.quickHack();
    window.deployVirus = () => game.deployVirus();
    window.scanNetwork = () => game.scanNetwork();
    window.emergencyExit = () => game.emergencyExit();
    window.resetSystem = () => game.resetSystem();
});

