---
title: Fluency Analyzer App
description: A distributed web platform for Welsh language fluency assessment, bridging academic research with practical applications for language learning and preservation.
slug: fluency-analyzer-app
date: May 23, 2025
published: True
---

# From Research Paper to Reality: Building the Fluency Analyzer

The foundation for this project started during my MSc thesis research on Welsh language fluency assessment. What began as academic exploration evolved into something much more ambitious during my time as an ML Engineer at Swansea University. 

The research methodology was solid, but there was clearly potential for a genuinely innovative approach that could work in production environments. The core thesis work was completely rethought and restructured for scalable deployment.

The end result is a full-scale, production-ready application deployed on the university's intranet, actively helping Welsh learners improve their fluency through analytics and feedback.

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

## System Overview

The Fluency Analyzer is a production-ready web application built on a robust microservice architecture, all containerized with Docker for seamless deployment and scaling. The system supports Welsh language analysis through 10 carefully selected phrases, accepting both real-time recordings and uploaded audio files.

The distributed architecture processes speech through multiple specialized services, delivering comprehensive fluency analysis that extends far beyond simple binary assessments. The application functions as a sophisticated linguistic analysis tool capable of evaluating dozens of acoustic and semantic features simultaneously.

## Technical Architecture: Production-Grade Distributed Systems

### Frontend: Strategic Cross-Platform Development

Expo was selected for its proven cross-platform capabilities and production-grade audio handling. The framework provides native audio recording and playback functionality while maintaining consistent behavior across web, iOS, and Android platforms.

The interface design prioritizes accessibility, transforming complex linguistic metrics into intuitive visualizations. Development efficiency was significantly enhanced through hot reloading capabilities, enabling rapid iteration cycles and streamlined stakeholder demonstrations.

### Microservices Architecture: Built for Scale


The backend operates on a 3-microservice architecture, each containerized with Docker for optimal deployment flexibility. The API Gateway Service acts as the central hub using FastAPI, managing routing and rate limiting for incoming requests. The Audio Processing Service handles all audio-related tasks including preprocessing, feature extraction, and format standardization. Finally, the ML Inference Service runs the fluency assessment models with optimized inference pipelines.

This distributed design provides critical production advantages. Each service can be scaled independently based on demand patterns, which is particularly important since audio processing and ML inference have different computational requirements. If one service experiences issues, the others continue operating normally, ensuring system resilience. Additionally, ML models can be updated or retrained without affecting the API layer, allowing for continuous improvement without downtime. Service-to-service communication is optimized through FastAPI's async capabilities, while comprehensive OpenAPI documentation facilitates development and maintenance.

### ML Pipeline: Advanced Linguistic Analysis

The machine learning components represent the core innovation of the system. The distributed ML pipeline performs sophisticated analysis across multiple dimensions, starting with acoustic feature extraction that uses advanced signal processing to capture subtle phonetic characteristics of Welsh speech patterns. The system then conducts temporal analysis, measuring speech timing comprehensively including pause patterns, hesitation detection, and rate variations.

Semantic assessment forms another crucial component, analyzing vocabulary diversity and evaluating contextual appropriateness of word choices. The final step involves comparative benchmarking, where individual performance is contextualized against the novel [dataset](https://zenodo.org/records/15463418) of Welsh language speakers.

The challenge was architecting this complexity into a system that provides actionable insights rather than overwhelming technical output. The inference service transforms raw acoustic features and model predictions into meaningful educational feedback.

## Production Deployment and Scaling Considerations

Transitioning from research prototype to production system revealed several critical engineering challenges that had to be solved. Model optimization became a crucial focus, requiring careful balance between inference accuracy and response time requirements. This was achieved through ONNX (Open Neural Network Exchange) optimization, which allowed for cross-platform model deployment and significant performance improvements through optimized runtime execution and GPU acceleration techniques.

Audio preprocessing standardization proved more complex than anticipated, necessitating robust preprocessing pipelines to handle the diversity of recording devices and audio formats that users might employ. Building reliability into the distributed system architecture required implementing comprehensive fault tolerance and graceful degradation mechanisms across all microservices.

Performance monitoring became essential, leading to the implementation of Prometheus for metrics collection and Grafana for visualization and alerting. This monitoring stack provides real-time insights into system performance, service health, and user interaction patterns, enabling proactive maintenance and optimization.

The university intranet deployment provided an ideal environment for controlled rollout and performance validation while maintaining data security and compliance requirements.

## Impact and Applications

The Fluency Analyzer represents a significant step toward several ambitious goals for Welsh language technology. Speech therapy applications form a key target domain, where quantitative progress tracking and detailed acoustic analysis could revolutionize how therapeutic interventions are supported with data-driven insights.

Welsh-English translation capabilities represent another major objective, leveraging the fluency assessment foundations to build more sophisticated bilingual processing systems. Perhaps most significantly, this work contributes to the Welsh Government's ambitious goal of reaching one million Welsh speakers by supporting scalable, accessible language learning infrastructure.

The system's architecture positions it to democratize access to professional-grade fluency assessment tools, making sophisticated linguistic analysis available at scale. This technological foundation could prove instrumental in supporting the broader vision of Welsh language revitalization and preservation.

## Future Development Roadmap

Several enhancement opportunities have emerged from production usage patterns and user feedback. Multi-language support represents a natural evolution, extending the current architecture to support additional languages beyond Welsh while leveraging the existing infrastructure. CEFR integration has become a priority, implementing [CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions) level assessments as the standardized proficiency framework that educators increasingly expect.

Personalized learning capabilities are being explored, developing adaptive recommendation systems based on individual performance patterns and learning trajectories. Offline capabilities represent another significant development area, implementing edge deployment for areas with limited connectivity, which is particularly relevant for rural Welsh communities where internet access can be unreliable.

## System Architecture

<Mermaid>
graph TB
    subgraph "Client Layer"
        Web[Web App]
        Mobile[Mobile App]
        Upload[Audio Upload]
    end
    
    subgraph "University Intranet"
        subgraph "Load Balancer"
            LB[Nginx Load Balancer]
        end
        
        subgraph "Microservices (Docker Containers)"
            subgraph "API Gateway Service"
                API[FastAPI Gateway]
                Rate[Rate Limiting]
            end
            
            subgraph "Audio Processing Service"
                Preprocess[Audio Preprocessing]
                Features[Feature Extraction]
                Validate[Format Validation]
            end
            
            subgraph "ML Inference Service"
                Model[ONNX Optimized Models]
                Pipeline[ML Pipeline]
                Results[Results Processing]
            end
        end
        
        subgraph "Data Layer"
            DB[(PostgreSQL)]
            Cache[(Redis Cache)]
            Storage[(Audio Storage)]
        end
        
        subgraph "Monitoring Stack"
            Prometheus[Prometheus Metrics]
            Grafana[Grafana Dashboard]
            Alerts[Alert Manager]
        end

        subgraph "External Resources"
            Dataset[Welsh Dataset]
        end
    end

    Web --> LB
    Mobile --> LB
    Upload --> LB
    
    LB --> API
    API --> Rate
    API --> Preprocess
    
    Preprocess --> Features
    Features --> Validate
    Validate --> Model
    
    Model --> Pipeline
    Pipeline --> Results
    Results --> API
    
    API --> DB
    API --> Cache
    Preprocess --> Storage
    
    Model -.-> Dataset
    
    %% Monitoring connections
    API -.-> Prometheus
    Preprocess -.-> Prometheus
    Model -.-> Prometheus
    Prometheus --> Grafana
    Grafana --> Alerts
</Mermaid>

## Conclusion

The Fluency Analyzer demonstrates that innovative research can successfully transition to production-ready applications that deliver real value. The project validates the importance of architecting academic innovations for scalable deployment, proving that sophisticated linguistic analysis can be made accessible through thoughtful system design.

The combination of rigorous research methodology with production-grade engineering has created a platform that serves both educational and research communities. Most importantly, it establishes a foundation for continued innovation in computational linguistics and language learning technology.