// Home.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios'; // Mock Axios for API requests
import Home from './Home';

jest.mock('axios');

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays total donated value', async () => {
    (axios as any).mockResolvedValueOnce({
      data: {
        result: {
          balance: 1000000000000000000, // Assuming 1 RON donated
        },
      },
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Total Donated Value: 1 Ron')).toBeInTheDocument();
    });
  });

  test('displays top 5 donors', async () => {
    (axios as any).mockResolvedValueOnce({
      data: {
        results: [
          { to: '0x8f11877d6181484568b93b30039f5418f787c61c', from: '0xDonor1', status: 1, value: '1000000000000000000' },
          { to: '0x8f11877d6181484568b93b30039f5418f787c61c', from: '0xDonor2', status: 1, value: '500000000000000000' },
          // Add more test data as needed
        ],
      },
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Top 5 Donors')).toBeInTheDocument();
      expect(screen.getByText('0xDonor1: 1 Ron')).toBeInTheDocument();
      expect(screen.getByText('0xDonor2: 0.5 Ron')).toBeInTheDocument();
      // Add assertions for other donors as needed
    });
  });
});
