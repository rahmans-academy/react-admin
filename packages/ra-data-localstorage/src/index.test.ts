import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MyComponent from './MyComponent';

jest.mock('axios');

describe('MyComponent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call updateLocalStorage and add response data to data object when resource does not exist', async () => {
    const data = {};
    const resource = 'users';
    const response = { data: { id: 1, name: 'John Doe' } };

    axios.create.mockReturnValue({
      post: jest.fn().mockResolvedValue(response),
    });

    render(<MyComponent data={data} resource={resource} />);

    await waitFor(() => {
      expect(axios.create).toHaveBeenCalledTimes(1);
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
      });
    });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(axios.create().post).toHaveBeenCalledTimes(1);
      expect(axios.create().post).toHaveBeenCalledWith('/users', {});
    });

    await waitFor(() => {
      expect(data).toEqual({ users: [response.data] });
    });
  });
});