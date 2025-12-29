'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop'
import { useToast } from '@/components/Toast'

// Helper function to create the cropped image from the canvas
async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
): Promise<Blob | null> {
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => (image.onload = resolve))

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return null

    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

    canvas.width = safeArea
    canvas.height = safeArea

    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-safeArea / 2, -safeArea / 2)

    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    )

    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.putImageData(
        data,
        0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
        0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    )

    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            resolve(file)
        }, 'image/png')
    })
}

export default function ImageCropper() {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(16 / 9)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)
    const { showToast } = useToast()

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error')
                return
            }
            const reader = new FileReader()
            reader.addEventListener('load', () => setImageSrc(reader.result as string || null))
            reader.readAsDataURL(file)
            setCroppedImage(null) // Reset previous crop
        }
    }

    const showCroppedImage = useCallback(async () => {
        if (!imageSrc || !croppedAreaPixels) return

        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
            if (croppedBlob) {
                setCroppedImage(URL.createObjectURL(croppedBlob))
                showToast('Image cropped successfully!', 'success')
            }
        } catch (e) {
            console.error(e)
            showToast('Failed to crop image', 'error')
        }
    }, [imageSrc, croppedAreaPixels, rotation, showToast])

    const aspectRatios = [
        { label: '16:9', value: 16 / 9 },
        { label: '4:3', value: 4 / 3 },
        { label: '1:1', value: 1 },
        { label: 'Free', value: undefined },
    ]

    return (
        <div className="space-y-6">
            {!imageSrc ? (
                <div className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-20 transition-colors hover:border-zinc-500 hover:bg-zinc-900">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-zinc-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-400">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500/20 hover:text-emerald-400"
                            >
                                <span>Upload an image</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleFileSelect}
                                />
                            </label>
                            <span>to start cropping</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Cropper UI */}
                    <div className="space-y-4">
                        <div className="relative h-96 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={aspect}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                            />
                        </div>

                        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Aspect Ratio</label>
                                <div className="flex flex-wrap gap-2">
                                    {aspectRatios.map((r) => (
                                        <button
                                            key={r.label}
                                            onClick={() => setAspect(r.value)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${aspect === r.value
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                                                }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Zoom: {zoom}</label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Rotation: {rotation}°</label>
                                <input
                                    type="range"
                                    value={rotation}
                                    min={0}
                                    max={360}
                                    step={1}
                                    aria-labelledby="Rotation"
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <button
                                onClick={showCroppedImage}
                                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
                            >
                                Crop Image
                            </button>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-zinc-200">Result</h3>
                        {croppedImage ? (
                            <div className="flex flex-col gap-4">
                                <div className="rounded-xl border border-zinc-700 bg-zinc-950/50 p-2">
                                    <img src={croppedImage} alt="Cropped" className="max-h-96 w-full rounded-lg object-contain" />
                                </div>
                                <a
                                    href={croppedImage}
                                    download="cropped-image.png"
                                    className="block w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-center text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:border-zinc-600"
                                >
                                    Download Cropped Image
                                </a>
                            </div>
                        ) : (
                            <div className="flex h-64 w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-500">
                                <p className="text-sm">Crop an image to see the result here</p>
                            </div>
                        )}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => {
                                    setImageSrc(null)
                                    setCroppedImage(null)
                                }}
                                className="text-sm text-zinc-500 hover:text-zinc-300 underline"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
