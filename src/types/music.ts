export interface MusicButton {
  text: string;
  primary: boolean;
}

export interface MusicItem {
  label: string | null;
  title: string;
  subtitle: string | null;
  image: string;
  buttons: MusicButton[];
}
