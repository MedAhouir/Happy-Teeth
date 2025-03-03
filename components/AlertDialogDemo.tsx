import Checkmark from "./Checkmark";
import WrongMark from "./Wrongmark";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  
  interface AlertDialogDemoProps {
    message: string;
    isSuccess: boolean | null;
    onClose: () => void;
  }
  
  export function AlertDialogDemo({ message, isSuccess, onClose }: AlertDialogDemoProps) {
    return (
      <AlertDialog open={isSuccess !== null} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={`flex flex-col items-center gap-2 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
              {isSuccess ? <Checkmark /> : <WrongMark/> }
              {message}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  