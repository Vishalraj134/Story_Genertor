export const generateStory = async (prompt: string, style: string, length: 'short' | 'medium' | 'long') => {
  try {
    const response = await fetch('https://story-genertor.onrender.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: `${prompt} ${style ? `in ${style} style` : ''}. Make it ${length} length.`
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate story');
    }

    if (!data.story) {
      throw new Error('No story content received');
    }

    return data.story;
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};