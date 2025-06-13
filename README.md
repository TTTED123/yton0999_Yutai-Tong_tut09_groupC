# Individual Task： Audio
yton0999_yutai-Tong_IDEA9103
## 1. Instructions:
1. Load `index.html`
1. Click any button on the screen to start drawing.
2. Tapping the first button (cross/parallel) can switch the generation direction of the lines. Tap the second button (sound1/sound2) to switch songs.
3. Changing the `sound mode` to `3` in the `sketch.js` file can enable the program to capture the sound from the microphone.
4. You can choose your favorite songs to generate the video by replacing the audio files in the code.

## 2. Details of the individual approach
1. **Overview**  
Based on the original group project, I added audio-driven features to achieve dynamic animation effects that respond to audio input. By using changes in sound (from a microphone or audio source), the visual images are influenced in real time, giving the generated images a greater sense of randomness. **There is a feature that I haven't been able to implement successfully.** I couldn't make the switch between the microphone and audio modes into interactive buttons. Because once the mode is switched to the microphone through a button, switching back to the audio mode becomes ineffective and audio cannot be read. So currently, the switch can only be done through code.

2. **Differentiation**  
I chose audio as the main driver for my personal code, dynamically controlling the changes of visual elements through two preloaded audio files and real-time input from the microphone. The size and transparency of the circular graphics are dynamically adjusted based on the changes in audio amplitude, which means the stronger the audio amplitude, the larger and more prominent the visual graphic (ellipse) diameter.

3. **Inspiration**  
My inspiration for animation design mainly comes from the common audio visualization effects in music players. Many music players transform sound into dynamic visual elements, such as waveforms, spectrum bars, and diffusing circular animations, allowing users to intuitively perceive the changes in music rhythm and intensity. This visual feedback enhances the immersive experience of music.  
![Screenshot of the music player](https://pic.vjshi.com/2023-11-30/a926547e0c704ac9999698c7ad2edab0/online/main.jpg?x-oss-process=style/video_cover_20231101)

    I drew inspiration from Spotify's music visualizer, where different types of sounds can generate a variety of rich patterns, such as the undulation of lines and the diffusion of circles. This gave me an idea: by mapping the dynamic attributes of music (such as volume and frequency peaks) to the visual elements in our group's code, we can create very different effects.Therefore, I combined the audio analysis results with the basic line patterns of our group, using the amplitude of the sound to control the size and transparency of the circular patterns, so that the picture could change in real time according to the different characteristics of the sound. Each run is unique and expressive.  
    [Spotify music visualization.](https://www.youtube.com/watch?v=QqnIFXI662Q&t=118s)  

## 3. Technical
1. In the `setup()` section, three different mode switches were added, with soundmode == 0/1/2. These are used to switch among three modes. Here, I attempted to use the function of p5.mic.
[Reference](https://archive.p5js.org/examples/sound-mic-input.html)

2. In the `draw()` section: If it is an audio file, use FFT to analyze the spectrum and find the position of the maximum frequency component `maxF`, and map it to the opacity value `opacity`. Since we only want the screen changes to focus on the low frequencies of the sound (drumbeats), to prevent the generated lines from being too chaotic, the value of `maxF` is set to 0-50. If it is a microphone input, directly take the microphone volume level using `mic.getLevel()` and map it to the opacity. At the same time, a new button `drawSoundButton()` is added to switch the sound mode.

3. In `displayStep()`, `ellipse()` is used to draw circles, the size of which is related to the sound input. `index` controls which circle is currently being drawn.
