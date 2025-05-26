import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Container,
  SelectChangeEvent,
} from '@mui/material';
import { generateStory } from '../config/openai';

const storyStyles = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Romance',
  'Horror',
  'Adventure',
  'Historical Fiction',
];

export const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStyleChange = (event: SelectChangeEvent) => {
    setStyle(event.target.value);
  };

  const handleLengthChange = (event: SelectChangeEvent) => {
    setLength(event.target.value as 'short' | 'medium' | 'long');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const generatedStory = await generateStory(prompt, style, length);
      setStory(generatedStory);
    } catch (err) {
      setError('Failed to generate story. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          AI Story Generator
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter your story prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              multiline
              rows={3}
              margin="normal"
              variant="outlined"
              error={!!error}
              helperText={error}
            />
            
            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Story Style</InputLabel>
                <Select
                  value={style}
                  onChange={handleStyleChange}
                  label="Story Style"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {storyStyles.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Story Length</InputLabel>
                <Select
                  value={length}
                  onChange={handleLengthChange}
                  label="Story Length"
                >
                  <MenuItem value="short">Short</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="long">Long</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Story'}
            </Button>
          </form>
        </Paper>

        {story && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Generated Story
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {story}
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}; 