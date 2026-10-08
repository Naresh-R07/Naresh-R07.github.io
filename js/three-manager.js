/**
 * THREE.JS SCENE MANAGER
 * Handles initialization and lifecycle of all 3D scenes
 */

class ThreeSceneManager {
  constructor() {
    this.scenes = new Map();
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '100px'
    };
    this.observer = new IntersectionObserver(
      (entries) => this.handleVisibility(entries),
      this.observerOptions
    );
  }

  /**
   * Register and initialize a 3D scene
   */
  registerScene(containerId, SceneClass) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container #${containerId} not found`);
      return;
    }

    const scene = new SceneClass(container);
    this.scenes.set(containerId, { scene, SceneClass, container });

    // Observe visibility
    this.observer.observe(container);

    return scene;
  }

  /**
   * Handle scene visibility changes for performance
   */
  handleVisibility(entries) {
    entries.forEach((entry) => {
      const sceneData = this.scenes.get(entry.target.id);
      if (!sceneData) return;

      if (entry.isIntersecting) {
        // Scene is visible
        if (sceneData.container.querySelector('canvas')) {
          // Already rendered, just resume
          sceneData.container.style.opacity = '1';
        }
      } else {
        // Scene is not visible
        sceneData.container.style.opacity = '0.5';
      }
    });
  }

  /**
   * Initialize all scenes
   */
  initializeAll() {
    // Hero scene (matrix rain + particles)
    const heroContainer = document.getElementById('hero');
    if (heroContainer) {
      const sceneContainer = document.createElement('div');
      sceneContainer.id = 'hero-three-scene';
      sceneContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      `;
      heroContainer.querySelector('.hero__bg').appendChild(sceneContainer);
      this.registerScene('hero-three-scene', HeroScene);
    }

    // Skills scene (rotating cubes)
    const skillsContainer = document.getElementById('skills');
    if (skillsContainer) {
      const sceneContainer = document.createElement('div');
      sceneContainer.id = 'skills-three-scene';
      sceneContainer.style.cssText = `
        width: 100%;
        height: 400px;
        margin-bottom: 2rem;
      `;
      skillsContainer.querySelector('.container').insertBefore(
        sceneContainer,
        skillsContainer.querySelector('.bento')
      );
      this.registerScene('skills-three-scene', SkillsScene);
    }

    // Projects scene (floating cards)
    const projectsContainer = document.getElementById('projects');
    if (projectsContainer) {
      const sceneContainer = document.createElement('div');
      sceneContainer.id = 'projects-three-scene';
      sceneContainer.style.cssText = `
        width: 100%;
        height: 500px;
        margin-bottom: 2rem;
      `;
      projectsContainer.querySelector('.container').insertBefore(
        sceneContainer,
        projectsContainer.querySelector('#projects-grid')
      );
      this.registerScene('projects-three-scene', ProjectsScene);
    }
  }

  /**
   * Clean up all scenes
   */
  dispose() {
    this.scenes.forEach(({ scene }) => {
      if (scene.dispose) {
        scene.dispose();
      }
    });
    this.scenes.clear();
    this.observer.disconnect();
  }
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.threeSceneManager = new ThreeSceneManager();
  window.threeSceneManager.initializeAll();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (window.threeSceneManager) {
    window.threeSceneManager.dispose();
  }
});
