import { useQRCode } from "next-qrcode";


interface Props {
      text: string;
}

export default function QRCodeGenerator({ text }: Props) {

      const { Canvas } = useQRCode();

      return (
            <Canvas
                  text={text}
                  options={{
                        errorCorrectionLevel: 'L',
                        margin: 3,
                        scale: 4,
                        width: 180,
                        color: {
                              dark: '#000000',
                              light: '#FFFFFF',
                        },
                  }}
            />
      );

}

