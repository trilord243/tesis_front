interface LoadingSpinnerProps {
  readonly size?: 'sm' | 'md' | 'lg';
  readonly className?: string;
}

function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${className}`} />
  );
}

interface LoadingProps {
  readonly message?: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly fullScreen?: boolean;
}

export function Loading({ message = 'Cargando...', size = 'md', fullScreen = false }: LoadingProps) {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <LoadingSpinner size={size} className="mx-auto text-brand-primary mb-4" />
        <p className="font-roboto text-brand-gray">{message}</p>
      </div>
    </div>
  );
}

interface LoadingPageProps {
  readonly title?: string;
  readonly description?: string;
}

export function LoadingPage({ 
  title = 'Centro Mundo X', 
  description = 'Cargando sistema de reservas...' 
}: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md">
        <div className="bg-brand-primary text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-roboto-condensed font-black">UM</span>
        </div>
        <h1 className="titular text-brand-primary mb-4">{title}</h1>
        <p className="font-roboto text-brand-gray mb-8">{description}</p>
        <LoadingSpinner size="lg" className="mx-auto text-brand-primary" />
      </div>
    </div>
  );
}

// Skeleton loading components for better UX
interface SkeletonProps {
  readonly className?: string;
  readonly width?: string;
  readonly height?: string;
}

export function Skeleton({ className = '', width = 'w-full', height = 'h-4' }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <Skeleton className="mx-auto mb-6" width="w-16" height="h-16" />
      <Skeleton className="mb-4" width="w-3/4" height="h-6" />
      <Skeleton className="mb-2" width="w-full" height="h-4" />
      <Skeleton className="mb-2" width="w-5/6" height="h-4" />
      <Skeleton width="w-4/5" height="h-4" />
    </div>
  );
} 