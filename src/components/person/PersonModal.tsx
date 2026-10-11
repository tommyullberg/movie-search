import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { PersonDetails } from './PersonDetails';
import { useSearchContext } from '../../contexts/SearchContext';
import { getPersonById } from '../../utils/apiUtils';
import { Loader2 } from 'lucide-react';

export interface PersonModalProps {
  personId: number;
  isOpen: boolean;
  closeModal: () => void;
}

export function PersonModal({ personId, isOpen, closeModal }: PersonModalProps) {
  const { personData, updatePersonData } = useSearchContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (personId > 0 && (!personData || personData.id !== personId)) {
      setIsLoading(true);
      getPersonById(personId)
        .then((data) => {
          updatePersonData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching person data:', err);
          setIsLoading(false);
        });
    }
  }, [personId, personData, updatePersonData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:w-[94vw] sm:max-w-4xl lg:max-w-5xl">
        {isLoading || !personData ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-muted-foreground">Loading person details...</p>
          </div>
        ) : (
          <PersonDetails personData={personData} onClose={closeModal} />
        )}
      </DialogContent>
    </Dialog>
  );
}
