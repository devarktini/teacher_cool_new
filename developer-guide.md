# Developer Guide

## Progress Indicator

The application includes a global progress indicator that can be controlled from any component. This circular progress indicator supports custom colors and can be used to show loading states across the application.

### Basic Usage

```typescript
import { useDispatch } from 'react-redux'
import { startProgress, stopProgress } from '@/store/features/progressSlice'

function YourComponent() {
  const dispatch = useDispatch()

  const handleAsyncOperation = async () => {
    // Start loading with default blue color
    dispatch(startProgress())
    try {
      await someAsyncOperation()
    } finally {
      // Stop loading
      dispatch(stopProgress())
    }
  }
}
```

### Custom Colors

You can customize the progress indicator color for different scenarios:

```typescript
// Success (Green)
dispatch(startProgress({ color: '#22C55E' }))

// Error (Red)
dispatch(startProgress({ color: '#EF4444' }))

// Warning (Yellow)
dispatch(startProgress({ color: '#F59E0B' }))
```

### Best Practices

1. Always use `stopProgress` in a `finally` block to ensure the loader is removed:
```typescript
try {
  dispatch(startProgress())
  await someAsyncOperation()
} catch (error) {
  // Handle error
} finally {
  dispatch(stopProgress())
}
```

2. Use appropriate colors for different scenarios:
- Blue (#3B82F6) - Default loading
- Green (#22C55E) - Success operations
- Red (#EF4444) - Error states
- Yellow (#F59E0B) - Warning states

3. Consider using custom colors for specific features:
```typescript
// During file upload
dispatch(startProgress({ color: '#8B5CF6' })) // Purple

// During payment processing
dispatch(startProgress({ color: '#10B981' })) // Emerald
```

## Component Properties

The Progress component accepts the following props:

```typescript
interface ProgressProps {
  color?: string    // Custom color (default: '#3B82F6')
  size?: number     // Size in pixels (default: 40)
  thickness?: number // Circle thickness (default: 4)
}
```

## Integration Example

Here's a complete example using the progress indicator with an API call:

```typescript
import { useDispatch } from 'react-redux'
import { startProgress, stopProgress } from '@/store/features/progressSlice'

function ProductList() {
  const dispatch = useDispatch()

  const fetchProducts = async () => {
    dispatch(startProgress({ color: '#3B82F6' }))
    
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      
      if (!response.ok) {
        dispatch(startProgress({ color: '#EF4444' })) // Show error state
        await new Promise(resolve => setTimeout(resolve, 1000)) // Show error color briefly
        throw new Error('Failed to fetch products')
      }
      
      return data
    } finally {
      dispatch(stopProgress())
    }
  }
}
```

## Additional Notes

- The progress indicator includes a backdrop with blur effect
- It's centered on the screen with a semi-transparent background
- The animation is smooth and continuous
- The component is responsive and works on all screen sizes
- Multiple concurrent progress states are handled gracefully

Remember to use the progress indicator consistently throughout the application to provide a uniform user experience.

## SearchableDropdown Component

The SearchableDropdown component provides a searchable and customizable dropdown select input.

### Basic Usage

```typescript
import SearchableDropdown from '@/components/SearchableDropdown'

function YourComponent() {
  const [selected, setSelected] = useState<Option>()
  
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ]

  return (
    <SearchableDropdown
      options={options}
      value={selected}
      onChange={setSelected}
      placeholder="Select an option"
    />
  )
}
```

### Props

```typescript
interface Option {
  value: string | number
  label: string
}

interface SearchableDropdownProps {
  options: Option[]              // Array of options to display
  value?: Option                // Currently selected option
  onChange: (option: Option) => void  // Callback when option is selected
  placeholder?: string          // Placeholder text when no option is selected
  className?: string           // Additional CSS classes
  isLoading?: boolean         // Show loading state
  disabled?: boolean          // Disable the dropdown
  error?: string             // Error message to display
}
```

### Advanced Usage

1. With Loading State:
```typescript
<SearchableDropdown
  options={options}
  value={selected}
  onChange={setSelected}
  isLoading={isLoading}
  placeholder="Loading options..."
/>
```

2. With Error Handling:
```typescript
<SearchableDropdown
  options={options}
  value={selected}
  onChange={setSelected}
  error={!selected ? 'Please select an option' : undefined}
/>
```

3. With Async Data:
```typescript
function AsyncDropdown() {
  const [options, setOptions] = useState<Option[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<Option>()

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch('/api/options')
        const data = await response.json()
        setOptions(data.map((item: any) => ({
          value: item.id,
          label: item.name
        })))
      } finally {
        setIsLoading(false)
      }
    }
    fetchOptions()
  }, [])

  return (
    <SearchableDropdown
      options={options}
      value={selected}
      onChange={setSelected}
      isLoading={isLoading}
      placeholder="Select from API options"
    />
  )
}
```

4. With Custom Styling:
```typescript
<SearchableDropdown
  options={options}
  value={selected}
  onChange={setSelected}
  className="w-64 md:w-96"
  placeholder="Custom styled dropdown"
/>
```

### Features

- Search filtering of options
- Keyboard navigation support
- Click outside to close
- Loading state
- Error state
- Custom styling support
- Disabled state
- Mobile-friendly
- Typescript support

### Best Practices

1. Always provide meaningful labels for options
2. Handle loading states appropriately
3. Provide error feedback when needed
4. Use descriptive placeholders
5. Consider mobile users when styling
6. Implement proper error handling for async data

Remember to wrap the component in error boundaries and handle edge cases appropriately.

## Generic Table Component

The Table component is a highly customizable and type-safe table implementation.

### Basic Usage

```typescript
import Table, { Column } from '@/components/Table'

interface User {
  id: number
  name: string
  email: string
  role: string
}

function UserTable() {
  const columns: Column<User>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <span className="capitalize">{row.role}</span>
      )
    }
  ]

  const data: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
  ]

  return (
    <Table
      data={data}
      columns={columns}
      headerColor="#F3F4F6"
      selectedRowColor="#EFF6FF"
      striped
    />
  )
}
```

### Advanced Usage

1. With Sorting:
```typescript
const [sortedData, setSortedData] = useState(data)

const handleSort = (key: string, direction: 'asc' | 'desc') => {
  const sorted = [...data].sort((a, b) => {
    if (direction === 'asc') {
      return a[key] > b[key] ? 1 : -1
    }
    return a[key] < b[key] ? 1 : -1
  })
  setSortedData(sorted)
}

<Table
  data={sortedData}
  columns={columns}
  onSort={handleSort}
/>
```

2. With Row Selection:
```typescript
const [selectedUser, setSelectedUser] = useState<User>()

<Table
  data={data}
  columns={columns}
  selectedRow={selectedUser}
  onRowClick={setSelectedUser}
  selectedRowColor="#EFF6FF"
/>
```

3. With Custom Styling:
```typescript
<Table
  data={data}
  columns={columns}
  headerColor="#1E40AF"
  headerClassName="text-white"
  bordered
  dense
  striped
  stickyHeader
  maxHeight="400px"
/>
```

4. With Loading State:
```typescript
<Table
  data={data}
  columns={columns}
  isLoading={isLoading}
  emptyMessage="No users found"
/>
```

### Props

```typescript
interface TableProps<T> {
  data: T[]                    // Data to display
  columns: Column<T>[]         // Column definitions
  headerColor?: string         // Header background color
  selectedRowColor?: string    // Selected row background color
  hoverColor?: string         // Row hover background color
  onRowClick?: (row: T) => void // Row click handler
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  selectedRow?: T             // Currently selected row
  rowKey?: keyof T           // Unique key for rows
  isLoading?: boolean        // Loading state
  emptyMessage?: string      // Message when no data
  containerClassName?: string // Additional container classes
  headerClassName?: string   // Additional header classes
  rowClassName?: string     // Additional row classes
  cellClassName?: string    // Additional cell classes
  stickyHeader?: boolean    // Make header stick to top
  maxHeight?: string       // Max height of table container
  striped?: boolean       // Enable striped rows
  bordered?: boolean      // Add borders to cells
  dense?: boolean        // Reduce cell padding
}

interface Column<T> {
  key: string           // Column key
  header: string       // Column header text
  render?: (row: T) => React.ReactNode  // Custom cell renderer
  sortable?: boolean  // Enable sorting for column
  width?: string     // Column width
}
```

### Best Practices

1. Always provide unique row keys
2. Use type parameters for type safety
3. Implement proper sorting logic
4. Handle loading states appropriately
5. Consider mobile responsiveness
6. Use custom renderers for complex cell content
7. Implement proper error boundaries

Remember to wrap the table in a container with proper width constraints and handle overflow appropriately.

## Charts

The application includes reusable chart components built on top of Recharts library.

### Line Chart

```typescript
import LineChart from '@/components/charts/LineChart'

const data = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  // ...
]

<LineChart 
  data={data}
  xAxisKey="month"
  lines={[
    { key: 'sales', color: '#1f77b4' },
    { key: 'orders', color: '#2ca02c' },
  ]}
  height={300}
/>
```

### Bar Chart

```typescript
import BarChart from '@/components/charts/BarChart'

const data = [
  { category: 'A', value1: 100, value2: 200 },
  { category: 'B', value1: 200, value2: 300 },
  // ...
]

<BarChart 
  data={data}
  xAxisKey="category"
  bars={[
    { key: 'value1', color: '#ff7f0e' },
    { key: 'value2', color: '#d62728' },
  ]}
  height={300}
  stacked={true}
/>
```

### Props

#### LineChart Props
```typescript
interface LineChartProps {
  data: any[]              // Data array
  lines: {                 // Lines configuration
    key: string           // Data key for the line
    color: string        // Line color
  }[]
  xAxisKey: string       // Key for X-axis values
  height?: number        // Chart height in pixels
}
```

#### BarChart Props
```typescript
interface BarChartProps {
  data: any[]              // Data array
  bars: {                  // Bars configuration
    key: string           // Data key for the bar
    color: string        // Bar color
  }[]
  xAxisKey: string       // Key for X-axis values
  height?: number        // Chart height in pixels
  stacked?: boolean      // Enable stacked bars
}
```

### Theme Colors

The charts use the application's theme colors by default:
- Primary: hsl(var(--chart-1))
- Secondary: hsl(var(--chart-2))
- Tertiary: hsl(var(--chart-3))
- Quaternary: hsl(var(--chart-4))
- Quinary: hsl(var(--chart-5))

### Best Practices

1. Use appropriate chart types:
   - Line charts for trends over time
   - Bar charts for comparisons
   - Stacked bars for part-to-whole relationships

2. Color selection:
   - Use contrasting colors for different data series
   - Follow your application's color scheme
   - Consider accessibility for color-blind users

3. Responsive design:
   - Charts automatically adjust to container width
   - Set appropriate height for the viewport
   - Consider mobile viewports

4. Data formatting:
   - Use consistent data structures
   - Pre-process data if needed
   - Handle null/undefined values

5. Performance:
   - Limit data points for better rendering
   - Use memoization for static data
   - Consider lazy loading for large datasets

## Global Popup Component

The application includes a customizable global popup system that can be used to display confirmations, success messages, or any other information with various themes and styles.

### Basic Usage

```typescript
import { usePopup } from '@/hooks/usePopup'

function YourComponent() {
  const popup = usePopup()

  const handleAction = () => {
    popup.show({
      title: 'Success!',
      description: 'Operation completed successfully',
      theme: 'success',
      onConfirm: () => {
        // Handle confirmation
      }
    })
  }
}
```

### Configuration Options

```typescript
interface PopupOptions {
  title: string;              // Popup title
  description: string;        // Main message
  theme?: 'success' | 'error' | 'warning' | 'info';  // Visual theme
  additionalData?: Array<{    // Optional key-value data to display
    key: string;
    value: string | number | boolean;
  }>;
  onConfirm?: () => void;    // Optional confirmation callback
}
```

### Theme Colors

- Success (Green): Used for successful operations
- Error (Red): Used for error messages
- Warning (Yellow): Used for cautionary messages
- Info (Blue): Used for general information

### Example Use Cases

1. Success Confirmation:
```typescript
popup.show({
  title: 'Item Created',
  description: 'New item has been successfully created',
  theme: 'success',
  additionalData: [
    { key: 'Item ID', value: '12345' },
    { key: 'Created At', value: new Date().toLocaleString() }
  ]
})
```

2. Error Message:
```typescript
popup.show({
  title: 'Error',
  description: 'Failed to save changes. Please try again.',
  theme: 'error'
})
```

3. Warning with Confirmation:
```typescript
popup.show({
  title: 'Delete Item',
  description: 'Are you sure you want to delete this item?',
  theme: 'warning',
  onConfirm: () => {
    // Handle deletion
  }
})
```

### Styling

The popup uses a glass morphism design with:
- Backdrop blur effect
- Semi-transparent background
- Smooth animations
- Responsive layout
- Theme-based colors and icons

### Best Practices

1. Theme Selection:
   - Use 'success' for completed operations
   - Use 'error' for failed operations
   - Use 'warning' for destructive actions
   - Use 'info' for general messages

2. Content Guidelines:
   - Keep titles short and clear
   - Provide descriptive messages
   - Use additionalData for important details
   - Include confirmation callbacks for actions

3. User Experience:
   - Show loading states when needed
   - Provide clear action buttons
   - Allow easy dismissal
   - Maintain consistent styling

4. Integration with Progress:
```typescript
const handleAction = async () => {
  dispatch(startProgress())
  try {
    await someOperation()
    popup.show({
      title: 'Success',
      description: 'Operation completed',
      theme: 'success'
    })
  } catch (error) {
    popup.show({
      title: 'Error',
      description: error.message,
      theme: 'error'
    })
  } finally {
    dispatch(stopProgress())
  }
}
```

Remember to:
- Handle both success and error cases
- Clean up resources properly
- Provide meaningful feedback
- Maintain consistent UX patterns
