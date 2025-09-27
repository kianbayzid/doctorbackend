import { HfInference } from '@huggingface/inference';

class HuggingFaceService {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);
  }

  async generateTLDR(text) {
    try {
      const response = await this.hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: 100,
          min_length: 20,
          do_sample: false
        }
      });

      return response.summary_text;
    } catch (error) {
      console.error('Error generating TLDR:', error);
      throw new Error('Failed to generate TLDR summary');
    }
  }
}

export default HuggingFaceService;