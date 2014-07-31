<?php
/**
 *                  ___________       __            __
 *                  \__    ___/____ _/  |_ _____   |  |
 *                    |    |  /  _ \\   __\\__  \  |  |
 *                    |    | |  |_| ||  |   / __ \_|  |__
 *                    |____|  \____/ |__|  (____  /|____/
 *                                              \/
 *          ___          __                                   __
 *         |   |  ____ _/  |_   ____ _______   ____    ____ _/  |_
 *         |   | /    \\   __\_/ __ \\_  __ \ /    \ _/ __ \\   __\
 *         |   ||   |  \|  |  \  ___/ |  | \/|   |  \\  ___/ |  |
 *         |___||___|  /|__|   \_____>|__|   |___|  / \_____>|__|
 *                  \/                           \/
 *                  ________
 *                 /  _____/_______   ____   __ __ ______
 *                /   \  ___\_  __ \ /  _ \ |  |  \\____ \
 *                \    \_\  \|  | \/|  |_| ||  |  /|  |_| |
 *                 \______  /|__|    \____/ |____/ |   __/
 *                        \/                       |__|
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Creative Commons License.
 * It is available through the world-wide-web at this URL:
 * http://creativecommons.org/licenses/by-nc-nd/3.0/nl/deed.en_US
 * If you are unable to obtain it through the world-wide-web, please send an email
 * to servicedesk@totalinternetgroup.nl so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this module to newer
 * versions in the future. If you wish to customize this module for your
 * needs please contact servicedesk@totalinternetgroup.nl for more information.
 *
 * @copyright   Copyright (c) 2014 Total Internet Group B.V. (http://www.totalinternetgroup.nl)
 * @license     http://creativecommons.org/licenses/by-nc-nd/3.0/nl/deed.en_US
 */
class TIG_PostNL_Block_Adminhtml_Widget_Grid_Column_Renderer_ShipmentType
    extends Mage_Adminhtml_Block_Widget_Grid_Column_Renderer_Text
{
    /**
     * Additional column names used.
     */
    const SHIPPING_METHOD_COLUMN = 'shipping_method';
    const PRODUCT_CODE_COLUMN    = 'product_code';

    /**
     * Renders the column value as a shipment type value (Domestic, EPS or GlobalPack)
     *
     * @param Varien_Object $row
     *
     * @return string
     */
    public function render(Varien_Object $row)
    {
        /**
         * @var Mage_Adminhtml_Block_Widget_Grid_Column $column
         */
        $column = $this->getColumn();

        /**
         * The shipment was not shipped using PostNL.
         */
        $postnlShippingMethods = Mage::helper('postnl/carrier')->getPostnlShippingMethods();
        $shippingMethod = $row->getData(self::SHIPPING_METHOD_COLUMN);
        if (!in_array($shippingMethod, $postnlShippingMethods)) {
            return '';
        }

        /**
         * Check if any data is available.
         */
        $value = $row->getData($column->getIndex());
        if (is_null($value) || $value === '') {
            return '';
        }

        $helper = Mage::helper('postnl/cif');

        $label         = '';
        $comment       = false;
        switch ($value) {
            case 'domestic':
                $label = $helper->__('Domestic');
                break;
            case 'domestic_cod':
                $label   = $helper->__('Domestic');
                $comment = $helper->__('COD');
                break;
            case 'avond':
                $label   = $helper->__('Domestic');
                $comment = $helper->__('Evening Delivery');
                break;
            case 'avond_cod':
                $label   = $helper->__('Domestic');
                $comment = $helper->__('Evening Delivery') . ' + ' . $helper->__('COD');
                break;
            case 'pg':
                $label = $helper->__('Post Office');
                break;
            case 'pg_cod':
                $label   = $helper->__('Post Office');
                $comment = $helper->__('COD');
                break;
            case 'pge':
                $label   = $helper->__('Post Office');
                $comment = $helper->__('Early Pickup');
                break;
            case 'pge_cod':
                $label = $helper->__('Post Office');
                $comment = $helper->__('Early Pickup') . ' + ' . $helper->__('COD');
                break;
            case 'pa':
                $label = $helper->__('Parcel Dispenser');
                break;
            case 'pa_cod':
                $label   = $helper->__('Parcel Dispenser');
                $comment = $helper->__('COD');
                break;
            case 'eps':
                $label = $helper->__('EPS');
                break;
            case 'globalpack':
                $label = $helper->__('GlobalPack');
                break;
            case 'buspakje':
                $label = $helper->__('Letter Box Parcel');

                if ($row->getData(self::PRODUCT_CODE_COLUMN) == '2928') {
                    $comment = $helper->__('Extra');
                }
                break;
        }

        $renderedValue = "<b>{$label}</b>";
        if ($comment) {
            $renderedValue .= "<br /><em>{$comment}</em>";
        }

        return $renderedValue;
    }

    /**
     * Renders the <col> element of the column. Added check for $this->getColumn()->getDisplay() == 'none' that causes
     * the entire element to be hidden.
     *
     * @return string
     *
     * @see Mage_Adminhtml_Block_Widget_Grid_Column_Renderer_Abstract::renderProperty()
     */
    public function renderProperty()
    {
        /**
         * @var Mage_Adminhtml_Block_Widget_Grid_Column $column
         */
        $column = $this->getColumn();

        $out = '';
        if ($column->hasData('display')) {
            $out .= " style='display:{$column->getDisplay()};'";
        }

        $width = $this->_defaultWidth;

        if ($column->hasData('width')) {
            $customWidth = $column->getData('width');
            if ((null === $customWidth) || (preg_match('/^[0-9]+%?$/', $customWidth))) {
                $width = $customWidth;
            }
            elseif (preg_match('/^([0-9]+)px$/', $customWidth, $matches)) {
                $width = (int)$matches[1];
            }
        }

        if (null !== $width) {
            $out .= ' width="' . $width . '"';
        }

        return $out;
    }
}
