import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import AgentForm from './AgentForm';
import useDropdownData from '../../../../../hooks/useDropdownData';

jest.mock('../../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../../ui/PhoneField', () => ({ label }) => (
  <input aria-label={label} />
));

jest.mock('../../../../ui/EmailField', () => ({ label }) => (
  <input aria-label={label} />
));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Autocomplete: ({ options = [], onChange, renderInput }) => (
      <div>
        {renderInput({ inputProps: {}, InputProps: {} })}
        <button
          type="button"
          onClick={() => onChange({}, options[0] || null)}
        >
          select-option
        </button>
      </div>
    ),
  };
});

function AgentFormHarness({ isEnabled = () => true, setValue = jest.fn() }) {
  const methods = useForm({
    defaultValues: {
      agents: [
        {
          AgentName: '',
          AgentCode: '',
          PrimaryAgt: '',
        },
      ],
    },
  });

  return (
    <AgentForm
      index={0}
      control={methods.control}
      isEnabled={isEnabled}
      isEditing
      setValue={setValue}
    />
  );
}

describe('Affinity AgentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDropdownData.mockReturnValue({
      data: [{ Agent_Name: 'Acme Agent', Agent_Code: 'A-100' }],
      loading: false,
    });
  });

  it('renders agent fields and contact inputs', () => {
    render(<AgentFormHarness />);

    expect(screen.getAllByText('Agent Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Agent Code').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Primary Agent?').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('1st Work Tel')).toBeInTheDocument();
    expect(screen.getByLabelText('1st Email')).toBeInTheDocument();
  });

  it('sets AgentCode and AgentName when selecting by name', async () => {
    const setValue = jest.fn();
    render(<AgentFormHarness setValue={setValue} />);

    await userEvent.click(screen.getAllByRole('button', { name: 'select-option' })[0]);

    expect(setValue).toHaveBeenCalledWith('agents.0.AgentCode', 'A-100');
    expect(setValue).toHaveBeenCalledWith('agents.0.AgentName', 'Acme Agent');
  });

  it('sets AgentCode and AgentName when selecting by code', async () => {
    const setValue = jest.fn();
    render(<AgentFormHarness setValue={setValue} />);

    await userEvent.click(screen.getAllByRole('button', { name: 'select-option' })[1]);

    expect(setValue).toHaveBeenCalledWith('agents.0.AgentCode', 'A-100');
    expect(setValue).toHaveBeenCalledWith('agents.0.AgentName', 'Acme Agent');
  });
});
