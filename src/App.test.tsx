import React, { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { StateXProvider } from '@cloudio/statex';
import App from './App';

let wrapper: React.FunctionComponent<{}>;

describe('StateX', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = ({ children }: { children?: ReactNode }) => {
      return <StateXProvider>{children}</StateXProvider>;
    };
  });

  test('renders learn statex link', () => {
    render(<App />, { wrapper });
    const linkElement = screen.getByText(/learn statex/i);
    expect(linkElement).toBeInTheDocument();
  });
});
