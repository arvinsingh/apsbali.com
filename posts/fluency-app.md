---
title: Fluency Analyzer App
description: A proof-of-concept web app showcasing the downstream applications of my novel dataset.
slug: fluency-analyzer-app
date: May 23, 2025
published: True
---

# Fluency Analyzer: Bridging Research and Practical Applications

Developed during my time at Swansea University as [ML Researcher](https://sites.google.com/site/csgarykl/supervision?authuser=0#:~:text=2024%2D25%20Arvinder%20Bali%20(EPSRC%20IAA%20Fund%2C%20AI/ML%20Researcher)), Fluency Analyzer is a proof-of-concept application I built to demonstrate real-world applications of our novel language fluency assessment model. This project showcases how academic research can translate into practical tools for language learners and educators.

<Slideshow 
  images={[
    '/blog/fluency-app/1.png',
    '/blog/fluency-app/2.png',
    '/blog/fluency-app/3.png',
    '/blog/fluency-app/4.png',
    '/blog/fluency-app/5.png'
  ]}
  autoplay={false}
  alt="Fluency Analyzer App"
  height={500}
/>

## Project Overview

The Fluency Analyzer provides automated assessment of Welsh language fluency from spoken samples (limited to 10 Welsh phrases for now 😊) . Users can record speech or upload audio files, and the system returns detailed fluency metrics and personalized feedback.

## Technical Architecture

### Frontend: Rapid Development with Expo

I chose Expo for the frontend development to enable rapid prototyping and iteration. Some key benefits included:

- **Cross-platform compatibility**: The same codebase works on web, iOS, and Android
- **Quick iteration cycles**: Hot reloading significantly sped up the development process
- **Rich media handling**: Native audio recording and playback functionality was essential for our speech analysis features
- **Simplified deployment**: Expo's streamlined publishing process made testing with stakeholders easier

The UI was designed to be intuitive, with a focus on visualizing complex fluency metrics in an accessible way. The interactive dashboard displays temporal fluency measures, hesitation patterns, and comparative analytics.

### Backend: Robust API with FastAPI

The backend was built using FastAPI, which provided:

- **High performance**: Asynchronous request handling to manage concurrent processing of audio files
- **Type safety**: Python type hints helped prevent errors when dealing with complex ML model inputs/outputs
- **Interactive documentation**: Auto-generated Swagger UI simplified API integration
- **Straightforward deployment**: Easy containerization with Docker

### ML Pipeline: Where the Magic Happens

While the frontend and backend architectures are important, the heart of this project is the machine learning pipeline. Our model combines:

1. **Speech processing**: Advanced audio feature extraction to capture subtle aspects of spoken Welsh language
2. **Temporal analysis**: Measuring pauses, hesitations, and speech rate variations
3. **Semantic assessment**: Evaluating vocabulary diversity and appropriateness
4. **Comparative benchmarking**: Contextualizing user performance against our novel [dataset](https://zenodo.org/records/15463418)

## [Research](https://github.com/arvinsingh/CymruFluency) to Production

Building this application highlighted several challenges in deploying research models to production:

- **Model optimization**: Reducing model size and inference time while maintaining accuracy
- **Audio preprocessing standardization**: Ensuring consistent results across different recording devices
- **Interpretable results**: Translating complex model outputs into actionable feedback for users
- **Scalability concerns**: Balancing computational requirements with responsiveness

## Impact and Applications

The Fluency Analyzer demonstrates the practical value of our research in several domains:

- **Language education**: Providing immediate, objective feedback to learners
- **Speech therapy**: Supporting therapists with quantitative measures of progress
- **Research advancement**: Enabling larger-scale data collection to further refine our models
- **Accessibility**: Making professional-level fluency assessment available to a wider audience

## Future Directions

This proof-of-concept has opened several promising avenues for future development:

- Extending the model to support additional languages, right now its limited to Welsh.
- Implementing more granular feedback mechanisms, I've heard [CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions) has become the defacto assessment model now.
- Exploring personalized learning recommendations based on identified weaknesses -- kind of like Duolingo or Babbel.
- Developing an offline mode for use in areas with limited connectivity.

## Conclusion

The Fluency Analyzer App demonstrates how cutting-edge ML research can be translated into practical applications with real-world impact. By focusing on the strengths of our novel dataset and model architecture, we've created a tool that provides valuable insights for Welsh language learners and educators alike.
