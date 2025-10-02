import { Component, signal, afterNextRender, OnInit, ChangeDetectionStrategy } from '@angular/core';
// Import common Angular directives/pipes we need
import { CommonModule } from '@angular/common';
// Chart.js is installed via npm, so we can import it directly
import { Chart } from 'chart.js';

// Define the shape of our data objects
interface Tab {
  target: string;
  label: string;
}

interface Skill {
  name: string;
  color: string; // Used for CSS class construction
}

@Component({
  selector: 'app-root',
  standalone: true,
  // We must import CommonModule to use Angular features like @if, @for, and [class]
  imports: [CommonModule],
  // Point to the external HTML and CSS files
  templateUrl: './app.html',
  styleUrl: './app.css', // Note: For this demo, we use global styles.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  // State Signals
  activeTab = signal<string>('ui-ux');
  skillsView = signal<'list' | 'badges'>('list');
  isChartInitialized = false;

  // Data Arrays
  tabs: Tab[] = [
    { target: 'ui-ux', label: 'Design & UI/UX' },
    { target: 'content', label: 'Content & Messaging' },
    { target: 'technical', label: 'Technical & Performance' },
  ];

  skills: Skill[] = [
    { name: 'Vue.js', color: 'green' },
    { name: 'Angular', color: 'red' },
    { name: 'C# / .NET Core', color: 'purple' },
    { name: 'Java', color: 'orange' },
    { name: 'PHP', color: 'blue' },
  ];

  // Lifecycle hook for initial setup
  ngOnInit(): void {
    // We use afterNextRender to ensure the <canvas> element is in the DOM
    // before we try to initialize Chart.js, especially for the initial tab.
    afterNextRender(() => {
      this.initializeChart();
    });
  }

  // Event handler for tab switching
  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
    // Only initialize the chart if the technical tab is opened AND it hasn't been done yet
    if (tab === 'technical' && !this.isChartInitialized) {
      this.initializeChart();
    }
  }

  // Event handler for toggling the skills display format
  toggleSkillsView(): void {
    this.skillsView.update(current => (current === 'list' ? 'badges' : 'list'));
  }

  // Method to set up the Chart.js instance
  initializeChart(): void {
    if (this.isChartInitialized) return;

    // We must ensure the element exists before getting the context
    const canvasElement = document.getElementById('performanceChart') as HTMLCanvasElement | null;
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const axisColor = '#cbd5e1';

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Unoptimized Site', 'Optimized Site'],
        datasets: [{
          label: 'Page Load Time (s)',
          data: [4.2, 1.1],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(20, 184, 166, 0.8)'
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(20, 184, 166, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Load Time (seconds)',
              color: axisColor
            },
            ticks: {
              color: axisColor
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: axisColor
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
    this.isChartInitialized = true;
  }
}
