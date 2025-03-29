
# MealStock API Integrations

This document provides an overview of the API integrations implemented for MealStock to connect with external services.

## 1. Claude API Integration

Claude AI is used for natural language processing and content generation:

- **Meal Description Generation**: Creates engaging, SEO-friendly descriptions for meal packages
- **Feedback Analysis**: Analyzes customer feedback to extract sentiments and actionable insights
- **Personalized Recommendations**: Generates AI-powered meal recommendations based on user preferences
- **Natural Language Search**: Processes natural language search queries for better discovery
- **Preservation Guides**: Creates detailed, customized food preservation and reheating guides

## 2. ElevenLabs API Integration

ElevenLabs is used for text-to-speech and voice generation:

- **Voice Profiles**:
  - Culinary Expert (Charlotte): For meal preparation and preservation guides
  - Delivery Agent (Liam): For delivery notifications
  - Customer Service (Sarah): For customer support responses
  - Guide Narrator (George): For general narration

- **Features**:
  - Audio generation for meal preservation instructions
  - Voice notifications for delivery updates in local dialects
  - Voice responses for common customer questions
  - QR code generation for audio instructions

## 3. Nigerian Payment Gateway Integrations

Multiple payment options are supported for the Nigerian market:

- **Paystack**: 
  - Card payments processing
  - Transaction verification
  
- **Flutterwave**:
  - Mobile money transfers
  - Bank transfers
  
- **Bank Transfer**:
  - Manual payment confirmation
  - Reference number tracking
  
- **Cash on Delivery**:
  - Order tracking
  - Payment status management

## 4. SMS Gateway Integration

Multiple SMS providers for reliable notifications:

- **Providers**:
  - Termii (primary)
  - Twilio (fallback)
  - Africa's Talking (alternative)
  - Infobip (alternative)

- **Notification Types**:
  - Order confirmations
  - Delivery updates
  - Authentication codes
  - Special offer notifications
  - Payment confirmations

## 5. Sentry Error Tracking

Comprehensive error tracking and monitoring:

- **Frontend Error Monitoring**:
  - JavaScript exceptions
  - UI rendering issues
  
- **API Failure Tracking**:
  - Edge function errors
  - External API failures
  
- **Performance Monitoring**:
  - Response time tracking
  - Bottleneck identification
  
- **User Experience Issues**:
  - Form abandonment tracking
  - Navigation patterns
  - Payment process monitoring

## Security and Reliability

- **API Key Management**: All API keys are stored securely as edge function secrets
- **Fallback Mechanisms**: Each integration includes fallback handling for service disruptions
- **Error Logging**: Comprehensive error tracking with Sentry integration
- **Performance Tracking**: Response time monitoring for all external API calls

## Required Environment Variables

To ensure proper functioning, the following environment variables must be set:

- `CLAUDE_API_KEY`: For Claude API access
- `ELEVENLABS_API_KEY`: For ElevenLabs voice generation
- `PAYSTACK_SECRET_KEY`: For Paystack payment processing
- `TERMII_API_KEY`: For SMS notifications via Termii
- `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`: For fallback SMS via Twilio
- `AFRICASTALKING_API_KEY`: For alternative SMS provider
- `INFOBIP_API_KEY`: For alternative SMS provider

## Error Handling

All integrations follow these error handling principles:

1. **Retry Logic**: Automatic retries with exponential backoff for transient failures
2. **Fallback Content**: Default content generation when AI services are unavailable
3. **Detailed Logging**: Comprehensive error information captured in Sentry
4. **User Notifications**: Clear error messages for end users when services fail
