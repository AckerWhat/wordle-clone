import { Audio } from 'expo-av';

export class SoundManager {
  private static instance: SoundManager;
  private backgroundMusic: Audio.Sound | null = null;
  private victorySound: Audio.Sound | null = null;
  private defeatSound: Audio.Sound | null = null;
  private keyPressSound: Audio.Sound | null = null;
  private flipSound: Audio.Sound | null = null;
  private shakeSound: Audio.Sound | null = null;

  private constructor() {
    this.initializeAudio();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async initializeAudio() {
    try {
      // Configurar el modo de audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Cargar todos los sonidos
      await this.loadSounds();
    } catch (error) {
      console.log('Error initializing audio:', error);
    }
  }

  private async loadSounds() {
    try {
      // Música de fondo - puedes usar URLs de audio libre o archivos locales
      const { sound: bgMusic } = await Audio.Sound.createAsync(
        require("@/assets/sounds/music.mp3"), // URL de ejemplo
        { shouldPlay: false, isLooping: true, volume: 0.3 }
      );
      this.backgroundMusic = bgMusic;

      // Sonido de victoria
      const { sound: victory } = await Audio.Sound.createAsync(
        require("@/assets/sounds/victory.mp3"), // URL de ejemplo
        { shouldPlay: false, volume: 0.7 }
      );
      this.victorySound = victory;

      // Sonido de derrota
      const { sound: defeat } = await Audio.Sound.createAsync(
        require("@/assets/sounds/fail.mp3"), // URL de ejemplo
        { shouldPlay: false, volume: 0.7 }
      );
      this.defeatSound = defeat;

      // Sonido de tecla presionada
      const { sound: keyPress } = await Audio.Sound.createAsync(
        require("@/assets/sounds/click.mp3"), // URL de ejemplo
        { shouldPlay: false, volume: 0.4 }
      );
      this.keyPressSound = keyPress;

      // Sonido de flip (volteo de fichas)
      const { sound: flip } = await Audio.Sound.createAsync(
        require("@/assets/sounds/flip.mp3"), // URL de ejemplo
        { shouldPlay: false, volume: 0.5 }
      );
      this.flipSound = flip;

      // Sonido de shake (movimiento de error)
      const { sound: shake } = await Audio.Sound.createAsync(
        require("@/assets/sounds/error.mp3"), // URL de ejemplo
        { shouldPlay: false, volume: 0.6 }
      );
      this.shakeSound = shake;

    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  }

  // Música de fondo
  public async playBackgroundMusic() {
    try {
      if (this.backgroundMusic) {
        await this.backgroundMusic.replayAsync();
      }
    } catch (error) {
      console.log('Error playing background music:', error);
    }
  }

  public async pauseBackgroundMusic() {
    try {
      if (this.backgroundMusic) {
        await this.backgroundMusic.pauseAsync();
      }
    } catch (error) {
      console.log('Error pausing background music:', error);
    }
  }

  public async stopBackgroundMusic() {
    try {
      if (this.backgroundMusic) {
        await this.backgroundMusic.stopAsync();
      }
    } catch (error) {
      console.log('Error stopping background music:', error);
    }
  }

  // Efectos de sonido
  public async playVictorySound() {
    try {
      if (this.victorySound) {
        await this.victorySound.replayAsync();
      }
    } catch (error) {
      console.log('Error playing victory sound:', error);
    }
  }

  public async playDefeatSound() {
    try {
      if (this.defeatSound) {
        await this.defeatSound.replayAsync();
      }
    } catch (error) {
      console.log('Error playing defeat sound:', error);
    }
  }

  public async playKeyPressSound() {
    try {
      if (this.keyPressSound) {
        await this.keyPressSound.replayAsync();
      }
    } catch (error) {
      console.log('Error playing key press sound:', error);
    }
  }

  public async playFlipSound() {
    try {
      if (this.flipSound) {
        await this.flipSound.replayAsync();
      }
    } catch (error) {
      console.log('Error playing flip sound:', error);
    }
  }

  public async playShakeSound() {
    try {
      if (this.shakeSound) {
        await this.shakeSound.replayAsync();
      }
    } catch (error) {
      console.log('Error playing shake sound:', error);
    }
  }

  // Limpiar recursos
  public async cleanup() {
    try {
      if (this.backgroundMusic) {
        await this.backgroundMusic.unloadAsync();
        this.backgroundMusic = null;
      }
      if (this.victorySound) {
        await this.victorySound.unloadAsync();
        this.victorySound = null;
      }
      if (this.defeatSound) {
        await this.defeatSound.unloadAsync();
        this.defeatSound = null;
      }
      if (this.keyPressSound) {
        await this.keyPressSound.unloadAsync();
        this.keyPressSound = null;
      }
      if (this.flipSound) {
        await this.flipSound.unloadAsync();
        this.flipSound = null;
      }
      if (this.shakeSound) {
        await this.shakeSound.unloadAsync();
        this.shakeSound = null;
      }
    } catch (error) {
      console.log('Error cleaning up sounds:', error);
    }
  }

  // Control de volumen
  public async setBackgroundMusicVolume(volume: number) {
    try {
      if (this.backgroundMusic) {
        await this.backgroundMusic.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      }
    } catch (error) {
      console.log('Error setting background music volume:', error);
    }
  }

  public async setSoundEffectsVolume(volume: number) {
    try {
      const sounds = [this.victorySound, this.defeatSound, this.keyPressSound, this.flipSound, this.shakeSound];
      for (const sound of sounds) {
        if (sound) {
          await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
        }
      }
    } catch (error) {
      console.log('Error setting sound effects volume:', error);
    }
  }
}